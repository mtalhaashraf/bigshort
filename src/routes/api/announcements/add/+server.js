import { postHandler, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { saveAnnouncement } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	console.log('Announcement Added!');
	const { type, text } = data;

	await saveAnnouncement({ createdAt: Date.now(), text, type });

	return useJSONResponse(200, {
		message: 'ok'
	});
});
