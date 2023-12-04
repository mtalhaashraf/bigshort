import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { deleteAnnouncement } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	const { id } = data;

	await deleteAnnouncement(id);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
