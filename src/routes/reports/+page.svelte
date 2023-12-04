<script>
	import { DataTable, DataTableSkeleton } from 'carbon-components-svelte';
	import { onMount } from 'svelte';

	import routes from '../../routes';

	let reports;

	let loading;

	onMount(async () => {
		loading = true;
		reports = await routes.api.getReports();
		loading = false;
	});
</script>

<svelte:head>
	<title>Reports</title>
</svelte:head>
{#if loading}
	<DataTableSkeleton headers={['Reported User', 'User Email', 'Message']} />
{:else}
	<DataTable
		title="Reports"
		headers={[
			{ key: 'reportedUser', value: 'Reported User' },
			{ key: 'userEmail', value: 'User Email' },
			{ key: 'message', value: 'Message' }
		]}
		rows={reports}
	>
		<svelte:fragment slot="cell-header" let:header>
			{#if header.key !== 'details' && header.key !== 'edit' && header.key !== 'cancelSubscription'}
				{header.value}
			{/if}
		</svelte:fragment>
	</DataTable>
{/if}
