<script>
	import { fade, fly, scale, crossfade, blur } from 'svelte/transition';
	import { quintOut, cubicInOut } from 'svelte/easing';

	export let visible = false;
	export let closeable = true;
	export let backdropClose = false;
	export let fluid = false;
	export const key = null;

	let className = '';
	export { className as class };

	export let closeEvent = () => {
		visible = false;
	};

	const [send, receive] = crossfade({
		duration: 1500,
		easing: quintOut
	});
</script>

<input type="checkbox" checked={visible} class="modal-toggle" />

{#if visible}
	<div
		transition:fade
		class="modal !bg-accent !bg-opacity-10 w-screen h-screen max-h-screen max-w-screen"
	>
		{#if backdropClose && closeable}
			<div class="h-screen w-screen absolute top-0 left-0" on:click={closeEvent} />
		{/if}
		<div
			transition:scale={{ duration: 300, start: 0.75, easing: cubicInOut }}
			class="flex flex-col bg-white w-96 max-h-11/12 max-w-screen rounded-box overflow-hidden shadow-xl z-50 {className}"
		>
			<!-- BEGIN: Header -->
			{#if $$slots['title']}
				<div class="flex w-full bg-base-200 border-b py-2 px-4">
					<!-- BEGIN: Title -->
					<div class="flex items-center text-lg font-bold gap-4">
						<slot name="title" />
					</div>
					<!-- END: Title -->

					<div class="flex flex-grow justify-end gap-4">
						<!-- BEGIN: Close Button -->
						{#if closeable}
							<div class="flex">
								<button class="btn btn-xs btn-circle btn-ghost" on:click={closeEvent}>
									<i class="fa fa-times" />
								</button>
							</div>
						{/if}
						<!-- END: Close Button -->
					</div>
				</div>
			{/if}
			<!-- END: Header -->

			<!-- BEGIN: Content -->
			{#if $$slots['default']}
				<div class="flex flex-col flex-grow overflow-y-auto {fluid ? '' : 'p-4'} ">
					<slot />
				</div>
			{/if}
			<!-- END: Content -->

			<!-- BEGIN: Modal Actions -->
			{#if $$slots['actions']}
				<div class="flex items-center w-full p-4 gap-2 border-t bg-base-200">
					<div class="flex min-w-max justify-end items-center gap-2">
						<slot name="actions" />
					</div>
				</div>
			{/if}
			<!-- END: Modal Actions -->
		</div>
	</div>
{/if}
