<script>
    import { createEventDispatcher } from 'svelte';
    export let headers = [];
    export let actions = [];// {name, icon}
    export let collection = [];
    const dispatch = createEventDispatcher();
    const handleEvent = (name, id) => {
        dispatch(name, {
            id
        });
    };
</script>
<div class="flex flex-col w-full min-h-screen max-h-screen">
    <div class="w-full border-2 rounded ">
        <!-- Grid Header -->
        <div class="flex w-full h-12 justify-center items-center font-bold bg-gray-200 sticky top-[76px] z-10">
            {#each headers as header}
                <span class="flex w-full items-center justify-center">
                    {header}
                </span>
            {/each}
            {#each actions as action}
                <span class="flex w-full items-center justify-center capitalize">
                    {action.name}
                </span>
            {/each}
        </div>
        <!-- Grid Body -->
        {#each collection as record (record.id)}
            <div class="flex w-full h-12 items-center justify-center border mt-1 rounded bg-gray-100 hover:bg-gray-200">
                <span class="flex w-full justify-center items-center">
                    {#each Object.values(record) as cell}
                        <span class="flex truncate w-full justify-center items-center"> {cell}</span>
                    {/each}
                    {#each actions as action}
                        <div class="flex w-full items-center justify-center">

                        
                        {#if action.icon}
                            <button class="flex w-full items-center justify-center" on:click={() => handleEvent(action.name, record.id)}>
                                <i  class={action.icon} ></i>
                            </button>
                        {:else if action.dropdown}
                        <select class="select select-bordered flex w-full items-center justify-center" on:click={() => handleEvent(action.name, record.id)}>
                            <option disabled selected>Select group</option>
                            <option>Paid</option>
                            <option>Moderator</option>
                          </select>
                        {:else}
                            <button class="border rounded-full flex w-full items-center justify-center"
                                    on:click={() => handleEvent(action.name, record.id)}>
                                        {action.name}
                            </button>
                        {/if}
                    </div>
                    {/each}
                </span>
            </div>
        {/each}
    </div>
</div>