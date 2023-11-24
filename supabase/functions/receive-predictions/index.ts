// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { Client } from "https://esm.sh/@microsoft/microsoft-graph-client";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


console.log("Hello from Functions!")

// create the supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);


// create a new folder
const createFolder = async (client: Client, mailFolder: Record<any, any>): Promise<void> => {
  // Code to create a new folder in Outlook
  let res = await client.api('/me/mailFolders')
      .post(mailFolder);

  return res;
}

const getFolderId = async(client: Client, folderName: string): Promise<void | string > => {
  // Get the folder Id from the folder name
  const folderIdRes = await client.api(`/me/mailFolders?$filter=displayName eq '${folderName}'`).get();
  return folderIdRes.value.length > 0 ? folderIdRes.value[0].id : null;
}

// move an email to a specified folder
const moveEmailToFolder = async (client: Client, emailId: string, folderId: string): Promise<void> => {
  // Code to move an email to a folder
  const message = {
    destinationId: folderId
  };

  await client.api(`/me/mailFolders/${folderId}/messages/${emailId}/move`)
      .post(message);
}

Deno.serve(async (req) => {
  try {
    const requestBody = await req.json();
    console.log(requestBody);
    const { request_type, uid, topics, topic_names, emails, access_token } = requestBody;

    if (!access_token) {
      return new Response("Access token not provided", {status: 400});
    }

    const client = Client.init({
      authProvider: (done) => {
        done(null, access_token);
      }
    });

    if (request_type === 'train') {

      // Step 1: Create new folders based on topic names
      // const folderIds = {};
      // for (const [topic, name] of Object.entries(topic_names)) {
      //   const res = await createFolder(client, {displayName: `${name}`});
      //   if (res?.id) {
      //     folderIds[topic] = res.id;
      //   }
      // }

      // Step 1: Define the folder names
      let folderNames = [
        "0_school_stuff",
        "1_applications",
        "2_academic_emails",
        "3_external_stuff"
      ];

      // Step 2: Move emails to their respective folders
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const topicIndex = topics[i];
        const folderName = folderNames[topicIndex];

        if (folderName) {
          const folderId = await getFolderId(client, folderName);
          if (folderId) {
            await moveEmailToFolder(client, email.id, folderId);
          }
        }
      }

      // Step 3: Store an array of folder ids associated to the labels for the user
      const filePath = `${uid}/folderIds.json`;

      // Upload the file & use upsert to replace it if it already exists
      const { error } = await supabase.storage.from('email-folders').upload(filePath, new Blob([JSON.stringify(folderNames)], { type: 'application/json'}), {upsert: true});

      if (error) {
        console.error('Failed to upload folderIds:', error);
      }

    } else if (request_type === 'test') {
      const filePath = `${uid}/folderIds.json`;

      // Load the folderIds.json file
      const { data, error } = await supabase.storage.from('email-folders').download(filePath);

      console.log(typeof data, data);

      if (error) {
        console.error('Failed to fetch folderIds:', error);
        throw error;
      }

      if (data instanceof Blob) {
        const arrayBuffer = await data.arrayBuffer();
        const folderNames = JSON.parse(new TextDecoder().decode(arrayBuffer));

        for (let i = 0; i < emails.length; i++) {
          const email = emails[i];
          const topicIndex = topics[i];
          const folderName = folderNames[topicIndex];

          if (folderName) {
            const folderId = await getFolderId(client, folderName);
            if (folderId) {
              await moveEmailToFolder(client, email.id, folderId);
            }
          }
        }

      } else{
        console.error('Unexpected data type:', typeof data);
        throw new Error('Unexpected data type');
      }
    } else {
      return new Response("Invalid request_type", {status: 400});
    }

  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }

  return new Response(
      JSON.stringify({ok: true}),
      { headers: { "Content-Type": "application/json" }, status: 200 },
  );
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
