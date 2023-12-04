import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { revokeUserToken } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	const { id } = data;
	await revokeUserToken(id);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
