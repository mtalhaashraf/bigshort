<script>
	import '../app.css';
	import { auth } from '$lib/firebase/client';
	import { Column, Content, Grid, Row } from 'carbon-components-svelte';
	import { onDestroy, onMount } from 'svelte';
	import Layout from '../lib/components/Layout.svelte';
	import LoginForm from '../lib/components/LoginForm.svelte';
	import { Loading } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import routes from '../routes';
	import { user } from '../stores/store';

	let authenticated = false;
	let unsubscribeObservable;
	let unsubscribeSnapshot;
	let signing = false;
	let loading = true;

	const handleLogout = () => {
		authenticated = false;
		auth.logout();
	};

	const onChange = async (userdata) => {
		if (!userdata) {
			authenticated = false;
		} else if (!signing && userdata) {
			authenticated = true;
			$user = userdata;
			goto(routes.users());
		}
		loading = false;
	};

	onMount(() => {
		unsubscribeObservable = auth.subscribeStateChangedObserver(onChange);
	});

	onDestroy(() => {
		unsubscribeSnapshot && unsubscribeSnapshot();
		unsubscribeObservable && unsubscribeObservable();
	});
</script>

{#if loading}
	<Loading />
{:else if authenticated}
	<Layout on:logout={handleLogout}>
		<slot />
	</Layout>
{:else}
	<Content>
		<Grid>
			<Row>
				<Column>
					<LoginForm bind:loading={signing} bind:authenticated />
				</Column>
			</Row>
		</Grid>
	</Content>
{/if}
