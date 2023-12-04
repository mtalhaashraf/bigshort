import { getHandler, useJSONResponse } from '$lib/handlers/api';

import { getUsers, getAllIPAddresses } from '$lib/firebase';
import { getAllSubscriptions } from '$lib/stripe';
import { equals, evolve, hasPath, map, pipe, __ } from 'ramda';

export const GET = getHandler(__, async () => {
	const subscriptions = await getAllSubscriptions();
	const ipAddresses = await getAllIPAddresses();
	let users = await getUsers();
	users = users?.map((user) => {
		if (hasPath(['stripe', 'subscriptionId'])(user)) {
			const subscription = subscriptions.find((sub) => equals(sub.id, user.stripe.subscriptionId));
			if (subscription) {
				user = {
					...user,
					stripe: {
						...user.stripe,
						status: subscription.status
					}
				};
			}
		}
		if (ipAddresses) {
			const ip = ipAddresses.find((e) => user.id === e.id);
			if (ip) {
				user = {
					...user,
					ip: ip
				};
			}
		}

		return user;
	});
	return useJSONResponse(200, {
		users
	});
});
