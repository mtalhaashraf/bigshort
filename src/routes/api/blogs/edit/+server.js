import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';
import { editBlog } from '$lib/firebase';
import { __ } from 'ramda';

export const POST = postHandler(__, async ({ data }) => {
	const { id, createdAt, title, description } = data;

	await editBlog(id, { createdAt, title, description });

	return useJSONResponse(200, {
		message: 'ok'
	});
});
