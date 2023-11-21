<script lang="ts">
	import Grid from './grid.svelte';

	import z from 'zod';

	import { setContext } from 'svelte';

	function calculateWinner(grid: string[]) {
		const winCondition = [
			[0, 1, 2], // top      -
			[3, 4, 5], // mid      -
			[6, 7, 8], // bot      -
			[0, 3, 6], // left     |
			[1, 4, 7], // mid      |
			[2, 5, 8], // right    |
			[0, 4, 8], // diagonal \
			[2, 4, 6] //  diagonal /
		];

		for (const line of winCondition) {
			const [a, b, c] = line;
			if (grid[a] !== '' && grid[a] === grid[b] && grid[a] === grid[c]) {
				if (debugMode) console.log(`winner is : ${grid[a]}!`);
				return;
			}
		}

		if (move === 9) {
			if (debugMode) console.log('draw');
			return;
		}
		if (debugMode) console.log('no winner');
	}

	function handleClick(index: number) {
		if (xIsNext === true) gridValue[index] = 'X';
		else gridValue[index] = 'O';
		xIsNext = !xIsNext;
	}

	let debugMode = true;
	setContext('debugMode', debugMode);

	let move = 0;
	let gridValue = [...Array(9)].map(() => '');
	let xIsNext = move % 2 === 0;

	$: {
		move;

		if (debugMode) console.log('grid : ', gridValue);
		calculateWinner(gridValue);
	}
</script>

<div class="grid w-fit grid-flow-row grid-cols-3">
	{#each gridValue as value, index}
		<Grid
			{value}
			on:click={() => {
				handleClick(index);
			}}
		></Grid>
	{/each}
</div>
