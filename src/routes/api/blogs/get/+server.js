import { getHandler, useJSONResponse } from '$lib/handlers/api';

import { getBlogs } from '$lib/firebase';
import { __ } from 'ramda';

export const GET = getHandler(__, async () => {
	const blogs = await getBlogs();
	return useJSONResponse(200, {
		blogs
	});
});
