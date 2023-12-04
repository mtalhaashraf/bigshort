import { useError, useJSONResponse, postHandler } from '$lib/handlers/api';
import { cancelSubscription } from '$lib/stripe';
import { __ } from 'ramda';

export const POST = postHandler(__, async ({ data }) => {
	try {
		const { id } = data;
		console.log("**********cancel******************");
		await cancelSubscription(id);
		return useJSONResponse(200, {
			message: 'Subscription canceled'
		});
	} catch (error) {
		return useError(500, 'Server Error');
	}
});
