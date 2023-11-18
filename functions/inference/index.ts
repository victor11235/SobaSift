// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Client } from "https://esm.sh/@microsoft/microsoft-graph-client";

let allMessages: any[] = [];

const getMessagesFromInbox = async (client: Client): Promise<void> => {
  try {
    let requestUrl = `/me/mailFolders/inbox/messages?$select=id,uniqueBody`;
    do {
      const res = await client
          .api(requestUrl)
          .header('Prefer', 'outlook.body-content-type="text"')
          .get();

      const formattedMessages = res.value.map((msg: any) => ({
        uniqueBody: msg.uniqueBody,
        id: msg.id
      }));

      allMessages = allMessages.concat(formattedMessages);

      requestUrl = res['@odata.nextLink'];
    } while (requestUrl);

  } catch (err) {
    console.log(err);
  }
};

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  allMessages = []; // Reset the array for each request
  const { user_id, access_token } = await req.json();

  if (!access_token) {
    return new Response("Access token not provided", {status: 400});
  }

  const client = Client.init({
    authProvider: (done) => {
      done(null, access_token);
    }
  });

  await getMessagesFromInbox(client);

  // Check if there are no emails in the inbox
  if (allMessages.length === 0) {
    console.log("No emails in the inbox.");
    return new Response(
        JSON.stringify({message: "No emails in the inbox"}),
        { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  }

  const test_emails = allMessages.map(msg => ({ uniqueBody: msg.uniqueBody, id: msg.id }));

  const json_request = {
    request_type: 'test',
    uid: user_id,
    test_emails: test_emails,
    access_token: access_token
  };

  // console.log("JSON Request: ", json_request);

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
    const responseData = await response.json();
    console.log('Emails sent successfully, received data:', responseData);
  }

  return new Response(
    JSON.stringify({emails: test_emails}),
    { headers: { "Content-Type": "application/json" }, status: 200},
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
