import { redirect } from '@sveltejs/kit';
// @ts-ignore
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();
	return {
		session
	};
}) satisfies PageServerLoad;

export const actions = {
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/');
		}
	},

	train: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		let userUUID = session.user?.id;
		const { data, error } = await supabase.rpc('train_model', {
			user_id_param: userUUID
		});

		if (error) {
			console.error('Error calling train_model:', error);
			return { status: 500, body: { error: 'Failed to call train_model' } };
		}

		return { status: 200, body: { data } };
	},

	deleteAuthToken: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		let userUUID = session.user?.id;

		if (!userUUID) {
			return { status: 400, body: { error: 'No user session found' } };
		}

		const { error } = await supabase.from('auth_tokens').delete().eq('user_id', userUUID);

		if (error) {
			console.error('Error deleting auth token:', error);
			return { status: 500, body: { error: 'Failed to delete auth token' } };
		}

		return { status: 200, body: { message: 'Auth token deleted successfully' } };
	}

} satisfies Actions;
