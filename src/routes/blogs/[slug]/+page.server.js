import { error } from '@sveltejs/kit';
import { equals } from 'ramda';
import { getBlogByID } from '$lib/firebase';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	if (params.slug) {
		if (equals(params.slug, 'add')) {
			return;
		} else {
			const doc = await getBlogByID(params.slug);
			const blog = doc.data();
			console.log(blog);
			if (blog) {
				return {
					...blog,
					id: doc.id
				};
			} else {
				throw error(404, 'Not found');
			}
		}
	}

	throw error(404, 'Not found');
}
