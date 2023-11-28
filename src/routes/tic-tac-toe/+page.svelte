<script lang="ts">
	import Grid from './grid.svelte';

	import z from 'zod';

	import { setContext } from 'svelte';
	import ToggleSwitch from '$lib/ToggleSwitch.svelte';

	function calculateWinner(grid: string[]): GameStatus {
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
				if (grid[a] === 'O') return 'winner is O';
				if (grid[a] === 'X') return 'winner is X';
			}
		}

		if (move === 9) {
			if (debugMode) console.log('draw');
			return 'draw';
		}

		if (debugMode) console.log('no winner');
		return '';
	}

	function handleClick(position: number) {
		if (gameStaus !== '') return;

		let girdCopy = [...gridValue]; // use spread syntax so I'm not copying a pointer to array.
		if (xIsNext === true) girdCopy[position] = 'X';
		else girdCopy[position] = 'O';
		move += 1;
		history.set(move, girdCopy);
		xIsNext = !xIsNext;
	}

	function gameReset() {
		move = 0;
		history.clear();
		history.set(
			move,
			[...Array(9)].map(() => '')
		);
		gridValue = history.get(move)!;
		xIsNext = move % 2 === 0;
		gameStaus = '';
	}

	type GameStatus = 'winner is O' | 'winner is X' | 'draw' | '';

	let debugMode = true;
	setContext('debugMode', debugMode);

	let move = 0;
	const history = new Map<number, string[]>().set(
		move,
		[...Array(9)].map(() => '')
	);
	let gridValue = history.get(move)!; // undefined workaround (non-null assertion)
	let xIsNext = move % 2 === 0;
	let gameStaus: GameStatus = '';

	$: {
		move;
		gridValue = history.get(move)!;
		gameStaus = calculateWinner(gridValue);

		if (debugMode) {
			console.log(`move : ${move}/${[...history].length - 1}\n` + `gridValue : ${gridValue}`);
			// console.log('game status : ', gameStaus);
		}
	}
</script>

<div class="flex flex-row gap-10">
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

	<div class="flex flex-col gap-5">
		<ToggleSwitch bind:switchState={debugMode}>
			<span slot="left-text">debug mode</span>
		</ToggleSwitch>
		<button
			class="h-fit w-fit rounded-full bg-cyan-500 px-5 pb-1 text-xl hover:bg-cyan-600"
			on:click={() => {
				gameReset();
			}}
		>
			Reset
		</button>
		<button
			class="h-fit w-fit rounded-full bg-cyan-500 px-5 pb-1 text-xl hover:bg-cyan-600"
			on:click={() => {
				if (move === 0) return;
				move -= 1;
			}}
		>
			Undo
		</button>
		<button
			class="h-fit w-fit rounded-full bg-cyan-500 px-5 pb-1 text-xl hover:bg-cyan-600"
			on:click={() => {
				if (move === [...history].length - 1) return;
				move += 1;
			}}
		>
			Redo
		</button>
	</div>
</div>

{#if debugMode}
	<div>
		<p>{`moves : ${move}/${[...history].length - 1}`}</p>
	</div>
	<div>
		{#key move}
			{#each history as record}
				<p>{`${record[0]} : ${record[1]}`}</p>
			{/each}
		{/key}
	</div>
{/if}
