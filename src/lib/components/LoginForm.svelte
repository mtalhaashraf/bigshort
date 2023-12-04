<script>
	import { auth, firestore } from '$lib/firebase/client';
	import {
		Button,
		InlineNotification,
		PasswordInput,
		TextInput,
		Tile
	} from 'carbon-components-svelte';
	import Page from './Page.svelte';
	import { goto } from '$app/navigation';
	import routes from '../../routes';
	import { equals } from 'ramda';

	let email = '';
	let password = '';
	let error = '';
	export let authenticated;
	export let loading = false;

	const handleLogin = async () => {
		error = '';
		loading = true;
		try {
			const {
				user: { uid }
			} = await auth.login(email, password);
			const { userGroup } = await firestore.getUserData(uid);
			if (userGroup && equals(userGroup, 'admin')) {
				authenticated = true;
				goto(routes.users());
				return;
			}
			auth.logout();
			throw { message: 'Not authorized' };
		} catch (e) {
			error = e.message || 'Server error';
		}
		loading = false;
	};
</script>

<Page>
	{#if !authenticated}
		<Tile>
			<TextInput bind:value={email} labelText="Email" />
			<PasswordInput bind:value={password} labelText="Password" />

			<Button on:click={handleLogin} disabled={loading}>{loading ? 'loading' : 'Login'}</Button>
		</Tile>
	{/if}
	{#if error}
		<InlineNotification title="Error" subtitle={error} />
	{/if}
	{#if authenticated}
		<InlineNotification kind="success" title="Success" subtitle="You've successfully logged in!" />
	{/if}
</Page>
