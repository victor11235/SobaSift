import { initializeGraphForUserAuth } from '$lib/graphHelper.js';

const settings = {
	clientId: '4d49baea-95e9-41ef-88a8-330ba6146d20',
	tenantId: 'common',
	graphUserScopes: ['user.read', 'mail.read', 'mail.send']
};

export const actions = {
	auth_outlook: async () => {
		const params = new URLSearchParams({
			client_id: '4d49baea-95e9-41ef-88a8-330ba6146d20',
			response_type: 'code',
			response_mode: 'query',
			scope: 'offline_access user.read mail.read'
		});

		const graphClient = initializeGraphForUserAuth(settings, (info) => {
			console.log(info.message);
			// The above console.log will print the device code information.
		});

		// Use the graphClient to call Microsoft Graph API
		const me = await graphClient.api('/me').get();
		console.log(me);

		return {
			body: {
				message: 'Authentication successful'
			}
		};
	}
};
