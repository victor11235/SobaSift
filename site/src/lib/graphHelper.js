// $lib/graphHelper.js

import 'isomorphic-fetch';
import { DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

let _settings = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;

export function initializeGraphForUserAuth(settings, deviceCodePrompt) {
	// Ensure settings isn't null
	if (!settings) {
		throw new Error('Settings cannot be undefined');
	}

	_settings = settings;

	_deviceCodeCredential = new DeviceCodeCredential({
		clientId: settings.clientId,
		tenantId: settings.tenantId,
		userPromptCallback: deviceCodePrompt
	});

	const authProvider = new TokenCredentialAuthenticationProvider(_deviceCodeCredential, {
		scopes: settings.graphUserScopes
	});

	_userClient = Client.initWithMiddleware({
		authProvider: authProvider
	});

	return _userClient;
}
