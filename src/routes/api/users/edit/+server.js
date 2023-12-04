import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { updateUser } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	const { id, ...rest } = data;
	await updateUser(id, rest);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
