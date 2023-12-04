import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { switchIPAddresses } from '$lib/firebase';

export const POST = postHandler(__, async ({ data }) => {
	const { id, ...rest } = data;
	await switchIPAddresses(id, rest);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
