<script>
	import {
		Button,
		DataTable,
		DataTableSkeleton,
		Modal,
		Select,
		SelectItem,
		TextInput,
		Toolbar,
		ToolbarContent
	} from 'carbon-components-svelte';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import TrashIcon from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { onMount } from 'svelte';
	import routes from '../../routes';

	let open = false;
	let isEdit = false;
	let editAnnouncementId = '';
	let text = '';
	let type = 'Danger';

	let loading;
	let announcements;

	const handleEdit = (e) => {
		const id = e.currentTarget.id;

		const announcement = announcements.find((anc) => anc.id === id);

		text = announcement?.text || '';
		type = announcement?.type || 'Danger';
		editAnnouncementId = announcement?.id || '';

		open = true;
		isEdit = true;
	};

	const handleAdd = () => {
		open = true;
	};

	const handleAddAnnouncement = async () => {
		open = false;
		loading = true;

		await routes.api.addAnnouncement({ text, type });

		announcements = await routes.api.getAnnouncements();

		loading = false;
	};

	const handleEditAnnouncement = async () => {
		open = false;
		loading = true;

		await routes.api.editAnnouncement({ id: editAnnouncementId, text, type });

		announcements = await routes.api.getAnnouncements();

		loading = false;

		text = '';
		type = 'Danger';
	};

	const handleDelete = async (e) => {
		const id = e.currentTarget.id;

		loading = true;

		await routes.api.deleteAnnouncement(id);

		announcements = await routes.api.getAnnouncements();

		loading = false;

		text = '';
		type = 'danger';
	};

	onMount(async () => {
		loading = true;
		announcements = await routes.api.getAnnouncements();
		loading = false;
	});
</script>

<svelte:head>
	<title>Announcements</title>
</svelte:head>

<Modal
	bind:open
	modalHeading={`${isEdit ? 'Edit' : 'Add'} announcement`}
	primaryButtonText={`${isEdit ? 'Update' : 'Confirm'}`}
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:submit={isEdit ? handleEditAnnouncement : handleAddAnnouncement}
>
	<TextInput bind:value={text} />
	<Select bind:selected={type}>
		<SelectItem value="danger" />
		<SelectItem value="info" />
		<SelectItem value="warning" />
		<SelectItem value="policy" />
	</Select>
</Modal>

{#if loading}
	<DataTableSkeleton headers={['Created At', 'Type', 'Text', '', '']} />
{:else}
	<DataTable
		title="Announcements"
		headers={[
			{ key: 'createdAt', value: 'Created At' },
			{ key: 'type', value: 'Type' },
			{ key: 'text', value: 'Text' },
			{ key: 'edit', value: 'Edit' },
			{ key: 'delete', value: 'Delete' }
		]}
		rows={announcements}
	>
		<Toolbar>
			<ToolbarContent>
				<Button on:click={handleAdd}>Add Announcement</Button>
			</ToolbarContent>
		</Toolbar>
		<svelte:fragment slot="cell-header" let:header>
			{#if header.key !== 'delete' && header.key !== 'edit'}
				{header.value}
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="cell" let:cell let:row>
			{#if cell.key === 'delete'}
				<Button
					id={row.id}
					on:click={handleDelete}
					kind="danger"
					iconDescription="Delete"
					icon={TrashIcon}
				/>
			{:else if cell.key === 'edit'}
				<Button
					id={row.id}
					on:click={handleEdit}
					kind="secondary"
					iconDescription="Edit"
					icon={EditIcon}
				/>
			{:else if cell.key === 'createdAt'}
				{new Date(cell.value).toDateString()}
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
	</DataTable>
{/if}
