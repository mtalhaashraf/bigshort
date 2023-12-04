import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';
import { deleteBlog } from '$lib/firebase';
import { __ } from 'ramda';

export const POST = postHandler(__, async ({ data }) => {
	const { id } = data;

	await deleteBlog(id);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
