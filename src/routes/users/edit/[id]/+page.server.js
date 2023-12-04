import { error } from '@sveltejs/kit';
import { getUserByUID } from '$lib/firebase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const user = await getUserByUID(params.id);
	if (user)
		return {
			user: { ...user, id: params.id }
		};

	throw error(404, 'Not found');
}
