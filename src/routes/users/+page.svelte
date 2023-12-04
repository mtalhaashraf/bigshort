<script>
	import { goto, invalidateAll } from '$app/navigation';
	import {
		Button,
		DataTable,
		DataTableSkeleton,
		Modal,
		Select,
		SelectItem,
		Toolbar,
		ToolbarContent,
		MultiSelect
	} from 'carbon-components-svelte';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import TrashIcon from 'carbon-icons-svelte/lib/RuleCancelled.svelte';
	import Delete from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Ban from 'carbon-icons-svelte/lib/ErrorFilled.svelte';
	import Unban from 'carbon-icons-svelte/lib/Unlocked.svelte';
	import Revoke from 'carbon-icons-svelte/lib/WatsonHealthRotate_180.svelte';
	import { equals, hasPath, values } from 'ramda';
	import { onMount } from 'svelte';
	import routes from '../../routes';
	import exportCSV from '$lib/exportCSV';
	import { user } from '../../stores/store';

	let users;
	let cancelId = '';
	let deleteId = '';
	let load = {
		multiselect: false,
		users: false,
		ban: false,
		revoke: false,
		group: false,
		deleteUser: false,
		cancelSubscription: false
	};

	const groups = [
		'guest',
		'register',
		'subscriber-pro',
		'subscriber-non-pro',
		'admin',
		'moderator'
	];

	const catchNLoad = async (name, fn) => {
		load[name] = true;
		try {
			await fn();
		} catch (error) {
			console.log(error);
		}
		load[name] = false;
	};

	const handleGroupChange = async (e, user) =>
		catchNLoad('group', async () => {
			const value = e.detail;
			await routes.api.editUser({ id: user.id, userGroup: value });
		});

	const handleCancelSubscription = (id) => {
		cancelId = id;
		load.cancelSubscription = true;
	};

	const handleDeleteUser = (id) => {
		deleteId = id;
		load.deleteUser = true;
	};

	const handleEdit = (id) => {
		goto(routes.editUser(id));
	};

	const handleRevokeToken = async (userId) =>
		catchNLoad('revoke', async () => {
			// await routes.api.editUser({ id: userId, accessToken: null });
			await routes.api.revokeToken(userId);
			await updateUsers();
		});

	const handleBanUser = async (userId) =>
		catchNLoad('ban', async () => {
			await routes.api.editUser({ id: userId, status: 'ban' });
			await updateUsers();
		});

	const handleUnbanUser = async (userId) =>
		catchNLoad('ban', async () => {
			await routes.api.editUser({ id: userId, status: 'unban' });
			await updateUsers();
		});

	const handleIPaddresses = async ({ selectedIds, unselected }, userId) =>
		catchNLoad('multiselect', async () => {
			console.log(unselected);
			await routes.api.switchIPAddresses({
				id: userId,
				ban: selectedIds,
				unban: unselected.map((e) => e.id) || []
			});
		});

	const handleExport = () => {
		exportCSV(users, 'users');
	};

	function capitalize(string) {
		const capitalFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		const chunks = string?.split('-');
		if (chunks.length) {
			let text = '';
			for (const chunk of chunks) {
				text = text + capitalFirst(chunk) + ' ';
			}
			return text;
		}
		return capitalFirst(string);
	}

	const updateUsers = async () => {
		users = await routes.api.getUsers();
		console.log(users);
	};

	onMount(async () => {
		catchNLoad('users', updateUsers);
		const r = await routes.api.getAllCanceledSubscriptions();
		console.log(r);
	});
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<Modal
	bind:open={load.cancelSubscription}
	on:click:button--primary={catchNLoad('users', async () => {
		load.cancelSubscription = false;
		await routes.api.cancelSubscription(cancelId);
		await updateUsers();
	})}
	on:click:button--secondary={() => {
		load.cancelSubscription = false;
	}}
	modalHeading="Cancel Subscription?"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
/>

<Modal
	bind:open={load.deleteUser}
	on:click:button--primary={catchNLoad('users', async () => {
		load.deleteUser = false;
		await routes.api.deleteUser(deleteId);
		await updateUsers();
	})}
	on:click:button--secondary={() => {
		load.deleteUser = false;
	}}
	modalHeading="Delete User?"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
/>

{#if load.users}
	<DataTableSkeleton
		title="Users"
		headers={[
			'Created At',
			'Last SignedIn',
			'Name',
			'Email',
			'Group',
			'Status',
			'IP Address',
			// Actions
			'Ban',
			'Revoke Token',
			'Edit',
			'Cancel Subscription',
			// 'Details',
			'Delete'
		]}
	/>
{:else}
	<DataTable
		title="Users"
		headers={[
			{ key: 'createdAt', value: 'Created At' },
			{ key: 'lastSignedIn', value: 'Last SignedIn' },
			{ key: 'name', value: 'Name' },
			{ key: 'email', value: 'Email' },
			{ key: 'userGroup', value: 'User Group' },
			{ key: 'status', value: 'Status' },
			{ key: 'ip', value: 'IP Addresses' },
			// Actions
			{ key: 'ban', value: 'Ban/Unban' },
			{ key: 'revoke', value: 'Revoke Token' },
			{ key: 'edit', value: 'Edit' },
			{ key: 'cancelSubscription', value: 'Cancel Subcription' },
			// { key: 'details', value: 'Details' },
			{ key: 'delete', value: 'Delete' }
		]}
		rows={users?.filter((e) => e.id !== $user.uid)}
	>
		<Toolbar>
			<ToolbarContent>
				<Button on:click={handleExport}>Export</Button>
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell-header" let:header>
			{#if header.key !== 'details' && header.key !== 'edit' && header.key !== 'cancelSubscription'}
				{header.value}
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="cell" let:cell let:row>
			{#if cell.key === 'cancelSubscription'}
				<Button
					disabled={!hasPath(['stripe', 'subscriptionId'])(row)}
					on:click={() => handleCancelSubscription(row.stripe.subscriptionId)}
					kind="danger"
					iconDescription="Cancel Subscription"
					icon={TrashIcon}
				/>
			{:else if cell.key === 'ban'}
				{#if row.status && equals(row.status, 'ban')}
					<Button
						on:click={() => {
							handleUnbanUser(row.id, row.ipAddresses);
						}}
						kind="primary"
						iconDescription="Unban User"
						icon={Unban}
						disabled={load.ban}
					/>
				{:else}
					<Button
						on:click={() => {
							handleBanUser(row.id, row.ipAddresses);
						}}
						kind="danger"
						iconDescription="Ban User"
						icon={Ban}
						disabled={load.ban}
					/>
				{/if}
			{:else if cell.key === 'edit'}
				<Button
					on:click={() => handleEdit(row.id)}
					kind="secondary"
					iconDescription="Edit"
					icon={EditIcon}
				/>
				<!-- {:else if cell.key === 'details'}
				<Button
					on:click={() => handleMoreDetails(row.id)}
					kind="secondary"
					iconDescription="More Details"
					icon={Details}
				/> -->
			{:else if cell.key === 'delete'}
				<Button
					on:click={() => handleDeleteUser(row.id)}
					kind="danger"
					iconDescription="Delete"
					icon={Delete}
				/>
			{:else if cell.key === 'revoke'}
				<Button
					disabled={!row.accessToken || load.revoke}
					on:click={() => handleRevokeToken(row.id)}
					iconDescription="Revoke"
					icon={Revoke}
				/>
			{:else if cell.key === 'name'}
				{row.displayName || row.username || '-'}
			{:else if cell.key === 'status'}
				{hasPath(['stripe', 'subscriptionId'])(row)
					? capitalize(row?.stripe?.status) || '-'
					: 'Not Subscribed'}
			{:else if cell.key === 'lastSignedIn'}
				{new Date(row.metadata.lastSignInTime).toDateString() || '-'}
			{:else if cell.key === 'createdAt'}
				{new Date(row.metadata.creationTime).toDateString() || '-'}
			{:else if cell.key === 'ip'}
				{#if row.ip}
					<MultiSelect
						selectedIds={row.ip?.ban || []}
						titleText="Ban/Unban"
						label="IP Addresses"
						items={row.ip.unban.map((ip) => ({ id: ip, text: ip }))}
						on:select={(e) => {
							handleIPaddresses(e.detail, row.id);
						}}
						disabled={load.multiselect}
					/>
				{:else}
					No IP Address
				{/if}
			{:else if cell.key === 'userGroup'}
				<Select selected={row.userGroup} on:change={(e) => handleGroupChange(e, row)}>
					{#if !row.userGroup}
						<SelectItem selected disabled value="Select Group" />
					{/if}
					{#each groups as group (group)}
						<SelectItem
							selected={equals(group, row.userGroup)}
							text={capitalize(group)}
							value={group}
							disabled={load.group}
						/>
					{/each}
				</Select>
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
	</DataTable>
{/if}
