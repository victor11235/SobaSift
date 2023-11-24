import type { RequestHandler } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { MICROSOFT_CLIENT_SECRET, MICROSOFT_CODE_VERIFIER } from '$env/static/private';

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession }, url }) => {
	const data = await request.json();
	const session = await getSession();

	const code = data.code;

	const tenant = 'common';
	const tokenUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
	const bodyData = new URLSearchParams();
	bodyData.append('client_id', '4d49baea-95e9-41ef-88a8-330ba6146d20');
	bodyData.append('grant_type', 'authorization_code');
	bodyData.append('code', code);
	bodyData.append('redirect_uri', `${url.origin}/account`);
	bodyData.append('code_verifier', `${MICROSOFT_CODE_VERIFIER}`);
	bodyData.append('client_secret', `${MICROSOFT_CLIENT_SECRET}`);
	bodyData.append('scope', 'https://graph.microsoft.com/mail.read offline_access');

	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: bodyData.toString()
	});

	const resp = await response.json();

	// console.log(resp);

	// to get when the access token expires
	let currentDate = new Date();
	let expires_at = new Date(currentDate.getTime() + resp.expires_in * 1000);

	// insert data into auth_tokens table
	const { data: insertData, error } = await supabase.from('auth_tokens').insert({
		user_id: session.user.id,
		access_token: resp.access_token,
		expires_at: expires_at.toISOString(),
		refresh_token: resp.refresh_token
	});

	// Check for an error
	if (error) {
		console.log(error);
		return fail(500, { error });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
