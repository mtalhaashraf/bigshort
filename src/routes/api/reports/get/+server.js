import { getHandler, useJSONResponse } from '$lib/handlers/api';

import { getReports } from '$lib/firebase';
import { __ } from 'ramda';

export const GET = getHandler(__, async () => {
	const reports = await getReports();
	return useJSONResponse(200, {
		reports
	});
});
