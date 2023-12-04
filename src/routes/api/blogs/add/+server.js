import { saveBlog } from '$lib/firebase';
import { postHandler, useJSONResponse } from '$lib/handlers/api';
import { __ } from 'ramda';

export const POST = postHandler(__, async ({ data }) => {
	const { title, description } = data;

	await saveBlog({ createdAt: Date.now(), title, description });

	return useJSONResponse(200, {
		message: 'ok'
	});
});
