import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { editAnnouncement } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	const { id, text, type } = data;

	await editAnnouncement(id, { text, type });

	return useJSONResponse(200, {
		message: 'ok'
	});
});
