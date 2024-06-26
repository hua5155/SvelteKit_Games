<script lang="ts">
	import Grid from './Grid.svelte';
	import MomentaryButton from './MomentaryButton.svelte';

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
		if (gridValue[position] !== '') return;

		let girdCopy = [...gridValue]; // use spread syntax so I'm not copying a pointer to array.
		if (xIsNext === true) girdCopy[position] = 'X';
		else girdCopy[position] = 'O';
		move += 1;
		history.set(move, girdCopy);
	}

	function gameReset() {
		move = 0;
		history.clear();
		history.set(
			move,
			[...Array(9)].map(() => '')
		);
		gridValue = history.get(move)!;
		gameStaus = '';
	}

	type GameStatus = 'winner is O' | 'winner is X' | 'draw' | '';

	let debugMode = false;

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
		xIsNext = move % 2 === 0;
		gridValue = history.get(move)!;
		gameStaus = calculateWinner(gridValue);

		if (debugMode) {
			console.log(`move : ${move}/${[...history].length - 1}\n` + `gridValue : ${gridValue}`);
			// console.log('game status : ', gameStaus);
		}
	}
</script>

<main class="flex h-full w-full flex-col items-center">
	<div class="h-10"></div>
	<div class="relative grid aspect-square w-4/5 grid-flow-row grid-cols-3 md:h-fit md:w-fit">
		{#each gridValue as value, index}
			<Grid
				on:click={() => {
					handleClick(index);
				}}
			>
				{value}
			</Grid>
		{/each}
		<!-- Mobile debug -->
		{#if debugMode}
			<div
				class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-[hsl(180,1%,25%)]/80 md:hidden"
			>
				<div class="text-left">
					<p>{`moves : ${move}/${[...history].length - 1}`}</p>
					{#key move}
						{#each history as record}
							<p class:line-through={move < record[0]}>{`${record[0]} : ${record[1]}`}</p>
						{/each}
					{/key}
				</div>
			</div>
		{/if}
	</div>
	<div class="h-10"></div>
	{#if gameStaus === ''}
		<p class="text-xl">{`${xIsNext ? 'X' : 'O'}'s Turn'`}</p>
	{:else}
		<p class="text-xl">{`${gameStaus}`}</p>
	{/if}
	<div class="h-10"></div>
	<div class="grid h-fit w-fit grid-cols-2 gap-5 md:grid-cols-4 [&>*]:h-9 [&>*]:w-28">
		<button
			class="inline-flex h-fit w-fit items-center justify-center rounded-full bg-[--color] p-0.5 text-xl text-cyan-400 transition-colors duration-300 md:hover:bg-[hsl(180,1%,45%)]"
			style:--color={debugMode ? 'hsl(180,1%,45%)' : 'hsl(180,1%,25%)'}
			on:click={() => {
				debugMode = !debugMode;
			}}
		>
			<span
				class="h-full w-full rounded-full bg-[--color] px-5 transition-colors duration-300 hover:bg-[hsl(180,1%,25%)]"
				style:--color={debugMode ? 'hsl(180,1%,45%)' : 'hsl(180,1%,25%)'}
			>
				Debug
			</span>
		</button>
		<MomentaryButton
			on:click={() => {
				gameReset();
			}}
		>
			Reset
		</MomentaryButton>
		<MomentaryButton
			on:click={() => {
				if (move === 0) return;
				move -= 1;
			}}
		>
			Undo
		</MomentaryButton>
		<MomentaryButton
			on:click={() => {
				if (move === [...history].length - 1) return;
				move += 1;
			}}
		>
			Redo
		</MomentaryButton>
	</div>

	<!-- Desktop debug -->
	{#if debugMode}
		<div class="h-10"></div>
		<div class="hidden h-fit w-96 rounded-lg bg-[hsl(180,1%,25%)] px-8 py-5 md:block">
			<p>{`moves : ${move}/${[...history].length - 1}`}</p>
			{#key move}
				{#each history as record}
					<p class:line-through={move < record[0]}>{`${record[0]} : ${record[1]}`}</p>
				{/each}
			{/key}
		</div>
	{/if}
</main>
