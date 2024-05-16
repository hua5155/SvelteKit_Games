<script lang="ts">
	import {
		readDebugMode,
		readDifficulty,
		readMine,
		readHint,
		readMask,
		readFlag
	} from './+page.svelte';

	const emoji = {
		bomb: '\u{1F4A3}',
		explode: '\u{1F4A5}',
		flag: '\u{1f6a9}' // \u2691
	} as const;

	export let index: number;

	$: debugMode = $readDebugMode;

	let isMasked = true;
	let isFlagged = false;
	let isMine = false;
	let hint = '';

	$: {
		isMasked = $readMask.has(index);
		isFlagged = $readFlag.has(index);
		isMine = $readMine.has(index);
		hint = $readHint.get(index)?.toString() ?? '';
	}
</script>

<button
	class="relative aspect-square w-10 bg-[hsl(98,11%,14%)] md:hover:bg-[hsl(98,11%,34%)]"
	on:click
	on:contextmenu|preventDefault
>
	{#if !isMasked || debugMode}
		{#if isMine}
			{isMasked ? emoji.bomb : emoji.explode}
		{:else}
			{hint}
		{/if}
	{/if}
	<div
		class="absolute left-0 top-0 flex aspect-square w-10 items-center justify-center bg-[hsl(96,16%,25%)] ease-in-out [transition:transform_300ms,_opacity_300ms] md:hover:bg-[hsl(96,16%,45%)]"
		class:scale-0={!isMasked}
		class:rounded-lg={!isMasked}
		class:opacity-50={debugMode}
	>
		{#if isFlagged}
			<p>{emoji.flag}</p>
		{/if}
	</div>
</button>
