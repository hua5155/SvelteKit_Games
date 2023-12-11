<script lang="ts">
	import {
		readMove,
		readDifficulty,
		readMine,
		readHint,
		readMask,
		readFlag,
		readDebugMode
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

	let isTopRight = index === $readDifficulty.col - 1;
	let isBotLeft = index === $readDifficulty.col * ($readDifficulty.row - 1);

	$: {
		$readMove;

		isMasked = $readMask.has(index);
		isFlagged = $readFlag.has(index);
		isMine = $readMine.has(index);
		hint = $readHint.get(index)?.toString() ?? '';
	}
</script>

<button
	class="group relative h-10 w-10 bg-[hsl(98,11%,14%)] first:rounded-tl-lg last:rounded-br-lg hover:bg-[hsl(98,11%,34%)]"
	class:rounded-tr-lg={isTopRight}
	class:rounded-bl-lg={isBotLeft}
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
		class="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center bg-[hsl(96,16%,25%)] ease-in-out [transition:transform_300ms,_opacity_300ms] hover:bg-[hsl(96,16%,45%)] group-first:rounded-tl-lg group-last:rounded-br-lg"
		class:rounded-tr-lg={isTopRight}
		class:rounded-bl-lg={isBotLeft}
		class:scale-0={!isMasked}
		class:rounded-lg={!isMasked}
		class:opacity-50={debugMode}
	>
		{#if isFlagged}
			<p>{emoji.flag}</p>
		{/if}
	</div>
</button>
