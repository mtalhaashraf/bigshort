<script>
	import { TextInput, Button, Tile, Loading, Link } from 'carbon-components-svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import routes from '../../../../routes';
	export let data;

	let editUser = data.user;

	let loading;

	const handleUserUpdate = async () => {
		loading = true;

		await routes.api.editUser(editUser);
		
		goto(routes.users());
		loading = false;
	};

	const handleClose = () => {
		goto(routes.users());
	};
</script>

{#if loading}
	<Tile>
		<Loading />
	</Tile>
{:else}
	<Tile>
		<TextInput bind:value={editUser.displayName} labelText="Display Name" />
		<TextInput bind:value={editUser.username} labelText="Username" />
		<TextInput bind:value={editUser.name} labelText="Name" />
		<TextInput bind:value={editUser.email} labelText="Email" />
		<TextInput bind:value={editUser.legalCompanyName} labelText="Legal Company Name" />
		<TextInput bind:value={editUser.location} labelText="Location" />
	</Tile>

	<Tile>
		<Button on:click={handleClose} kind="secondary">Back</Button>
		<Button on:click={handleUserUpdate}>Update</Button>
	</Tile>
{/if}
