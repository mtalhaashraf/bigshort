<script>
	import { goto } from '$app/navigation';
	import {
		Button,
		DataTable,
		DataTableSkeleton,
		Toolbar,
		ToolbarContent
	} from 'carbon-components-svelte';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import TrashIcon from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { onMount } from 'svelte';
	import routes from '../../routes';

	let loading;
	let blogs;

	const handleDelete = async (id) => {
		loading = true;
		await routes.api.deleteBlog(id);
		blogs = blogs.filter((e) => e.id !== id);
		loading = false;
	};

	const handleEdit = (id) => {
		goto(routes.editBlog(id));
	};

	const handleAddBlog = () => {
		goto(routes.addBlog());
	};

	onMount(async () => {
		loading = true;
		blogs = await routes.api.getBlogs();
		loading = false;
		
	});
</script>

<svelte:head>
	<title>Blogs</title>
</svelte:head>

{#if loading}
	<DataTableSkeleton title="Blogs" headers={['Created At', 'Title', 'Description', '', '']} />
{:else}
	<DataTable
		title="Blogs"
		headers={[
			{ key: 'createdAt', value: 'Created At' },
			{ key: 'title', value: 'Title' },
			{ key: 'description', value: 'Description' },
			{ key: 'edit', value: 'Edit' },
			{ key: 'delete', value: 'Delete' }
		]}
		rows={blogs}
	>
		<Toolbar>
			<ToolbarContent>
				<Button on:click={handleAddBlog}>Add Blog</Button>
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
					on:click={() => handleDelete(row.id)}
					kind="danger"
					iconDescription="Delete"
					icon={TrashIcon}
				/>
			{:else if cell.key === 'edit'}
				<Button
					on:click={() => handleEdit(row.id)}
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
