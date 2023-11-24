// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://esm.sh/@microsoft/microsoft-graph-client";

let allMessages: any[] = [];

// get the email body for all messages in the inbox
const getMessagesFromFolder = async (folderName: string, client: Client, isDefaultInbox: boolean = false): Promise<void> => {
  try {
    let folderId;

    // Check if it's the default inbox
    if (isDefaultInbox) {
      folderId = 'inbox';
    } else {
      // Attempt to find the folder by its name
      const folderIdRes = await client.api(`/me/mailFolders?$filter=displayName eq '${folderName}'`).get();

      // If the folder doesn't exist, exit early
      if (folderIdRes.value.length === 0) {
        console.log(`Folder ${folderName} does not exist.`);
        return;
      }
      folderId = folderIdRes.value[0].id;
    }

    let requestUrl = `/me/mailFolders/${folderId}/messages?$select=id,uniqueBody`;
    do {
      const res = await client
          .api(requestUrl)
          .header('Prefer', 'outlook.body-content-type="text"')
          .get();

      const category = isDefaultInbox ? -1 : parseInt(folderName.charAt(0));
      const formattedMessages = res.value.map((msg: any) => ({
        uniqueBody: msg.uniqueBody,
        id: msg.id,
        category
      }));

      allMessages = allMessages.concat(formattedMessages);

      requestUrl = res['@odata.nextLink'];
    } while (requestUrl);

  } catch (err) {
    console.log(err);
  }
};


console.log("Hello from Functions!")

serve(async (req:any) => {
  allMessages = []; // Reset the array for each request
  const { user_id, access_token } = await req.json();

  if (!access_token) {
    return new Response("Access token not provided", {status: 400}); // Return 400 Bad Request if no access token is provided
  }

  const client = Client.init({
    authProvider: (done) => {
      done(null, access_token);
    }
  });

  /*Get the emails from the specified folders*/
  await getMessagesFromFolder("0_school_stuff", client);
  await getMessagesFromFolder("1_applications", client);
  await getMessagesFromFolder("2_academic_emails", client);
  await getMessagesFromFolder("3_external_stuff", client);
  // await getMessagesFromFolder("", client, true);

  const train_categories = allMessages.map(msg => msg.category); // Generate training categories
  const train_emails = allMessages.map(msg => ({ uniqueBody: msg.uniqueBody, id: msg.id })); // Extract uniqueBody and ID

  // Prepare the JSON payload
  const json_request = {
    request_type: 'train',
    uid: user_id,
    train_emails,
    train_categories,
    test_emails: train_emails, // using the same array for testing
    access_token: access_token
  };

  console.log("JSON Request: ", json_request);

  const response = await fetch('https://api.runpod.ai/v2/hcyl8q7vad4jvh/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + Deno.env.get('RUNPOD_API_TOKEN'),
    },
    body: JSON.stringify({
      input: json_request
    }),
  });

  if (!response.ok) {
    console.error('Failed to send emails:', await response.text());
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  } else {
    const responseData = await response.json(); // parse JSON from the Flask response
    console.log('Emails sent successfully, received data:', responseData);
  }

  return new Response(
      JSON.stringify({emails: train_emails}),
      { headers: { "Content-Type": "application/json" }, status: 200 },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
