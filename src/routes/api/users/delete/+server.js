import { postHandler, useJSONResponse } from '$lib/handlers/api';
import { cancelSubscription } from '$lib/stripe';
import { deleteUser, getUserData, updateUser } from '$lib/firebase';
import { hasPath, __ } from 'ramda';

export const POST = postHandler(__, async ({ data }) => {
	const { id } = data;

	const user = await getUserData(id);

	if (user && hasPath(['stripe', 'subscriptionId'])(user)) {
		await cancelSubscription(user.stripe.subscriptionId);
	}

	await updateUser(id, {
		status: 'deleted'
	});

	await deleteUser(id);

	return useJSONResponse(200, {
		message: 'ok'
	});
});
