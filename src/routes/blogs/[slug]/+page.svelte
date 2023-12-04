<script>
	import Editor from '@tinymce/tinymce-svelte';
	import { Tile, Button, Loading, TextInput, Form } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import routes from '../../../routes';
	export let data;
	let loading = false;

	let title = data.title || '';
	let description = data.description || '';

	const handleSubmit = async (e) => {
		e.preventDefault();
		loading = true;
		if (data.id) {
			await routes.api.editBlog({ id: data.id, createdAt: data.createdAt, title, description });
		} else {
			await routes.api.addBlog({ title, description });
		}
		goto(routes.blogs());
		loading = false;
	};
</script>

{#if loading}
	<Loading />
{:else}
	<div class="w-full">
		<Form on:submit={handleSubmit}>
			<Tile>
				<TextInput bind:value={title} required placeholder="Enter blog title" />
			</Tile>

			<Tile>
				<Editor bind:value={description} required />
			</Tile>

			<Tile>
				<Button type="submit">
					{#if data.id}
						Update
					{:else}
						Save
					{/if}</Button
				>
			</Tile>
		</Form>
	</div>
{/if}
