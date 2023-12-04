import { getAllCanceledSubscriptions } from '$lib/stripe';
import { __ } from 'ramda';
import { getHandler ,useJSONResponse,useError } from '$lib/handlers/api';

export const GET = getHandler(__, async () => {

	const subscriptions = await getAllCanceledSubscriptions();

	if (subscriptions) {
		return useJSONResponse(200,{
			subscriptions
		})
	}

	return useError(401,'Not Found')
});
