<script context="module" lang="ts">
	import { derived, get, readable, readonly, writable } from 'svelte/store';

	const debugMode = writable(false);
	const difficultyPresets = {
		beginner: {
			col: 10,
			row: 10,
			mine: 15
		},
		Intermediate: {
			col: 16,
			row: 16,
			mine: 40
		},
		expert: {
			col: 30,
			row: 16,
			mine: 99
		}
	};
	const difficulties = ['beginner', 'Intermediate', 'expert'] as const;
	const difficulty = writable(difficultyPresets.beginner);
	const mine = writable(new Set<number>());
	const mask = writable(
		new Set<number>([...Array(get(difficulty).col * get(difficulty).row).keys()])
	);
	const flag = writable(new Set<number>());
	const hint = writable(new Map<number, number>());

	export const readDebugMode = readonly(debugMode);
	export const readDifficulty = readonly(difficulty);
	export const readMine = readonly(mine);
	export const readMask = readonly(mask);
	export const readFlag = readonly(flag);
	export const readHint = readonly(hint);
</script>

<script lang="ts">
	import Grid from './Grid.svelte';
	import MomentaryButton from './MomentaryButton.svelte';
	import NumberInput from '$lib/NumberInput.svelte';

	function clear() {
		flag.update((set) => {
			set.clear();
			return set;
		});
		mask.update((set) => {
			const total = $difficulty.col * $difficulty.row;
			for (let index = 0; index < total; index++) {
				set.add(index);
			}
			return set;
		});
		mine.update((set) => {
			set.clear();
			return set;
		});
		hint.update((map) => {
			map.clear();
			return map;
		});

		move.set(0);
		redoLimit.set(0);
		history.clear();
	}

	function randomize() {
		function randomizeMines() {
			const positions = new Set<number>();

			const { col, row, mine } = $difficulty;
			while (positions.size < mine) {
				positions.add(Math.floor(Math.random() * (col * row)));
			}

			return positions;
		}

		function calculateHint() {
			const indexes: number[] = [];
			const indexSet = new Set<number>();
			const hintMap = new Map<number, number>();

			$mine.forEach((index) => {
				indexes.push(...indexAround(index).filter((index) => !$mine.has(index)));
			});

			indexes.forEach((index) => {
				indexSet.add(index);
			});

			indexSet.forEach((index) => {
				hintMap.set(index, countHints(index, indexes));
			});

			return hintMap;
		}
		mine.set(randomizeMines());
		hint.set(calculateHint());
	}

	function indexAround(index: number) {
		let indexes: number[] = [];

		const { col, row } = $difficulty;
		for (
			let offsetRow = index >= col ? -1 : 0; // if on first row.
			offsetRow <= (Math.floor(index / col) === row - 1 ? 0 : 1); // if on last row.
			offsetRow++
		) {
			for (
				let offsetCol = index % col === 0 ? 0 : -1; // if on first col
				offsetCol <= (index % col === col - 1 ? 0 : 1); // if on last col
				offsetCol++
			) {
				let offsetIndex = index + col * offsetRow + offsetCol;
				if (offsetIndex === index) continue;
				indexes.push(offsetIndex);
			}
		}

		return indexes;
	}

	function countHints(index: number, array: number[]) {
		let counter = 0;
		array.forEach((value) => {
			if (value === index) counter += 1;
		});
		return counter;
	}

	function calculateStatus() {
		function compareSet<Type>(A: Set<Type>, B: Set<Type>) {
			const newA = new Set(A);
			const newB = new Set(B);

			if (newA.size !== newB.size) return false;

			newA.forEach((value) => {
				newB.delete(value);
			});

			if (newB.size !== 0) return false;
			return true;
		}

		function setDifferences<Type>(A: Set<Type>, B: Set<Type>) {
			const differences = new Set([...A, ...B]);
			A.forEach((index) => {
				differences.delete(index);
			});
			return differences;
		}

		let newPlayerState: PlayerEmoji = '🙂';

		$mine.forEach((index) => {
			if (!$mask.has(index)) newPlayerState = '🤕';
		});

		if (compareSet($mine, $mask)) {
			newPlayerState = '😎';
			flag.set(new Set([...$mask]));
		}

		return newPlayerState;
	}

	function handleRClick(index: number) {
		if (playerState !== '🙂') return;
		if (!$mask.has(index)) return;

		const indexes = new Set([index]);

		flag.update((set) => {
			if (!set.delete(index)) {
				set.add(index);
			}
			return set;
		});

		const newHistory: History = { event: 'Right', indexes: indexes };
		writeHistory(newHistory);
	}

	function handleLClick(index: number) {
		function countFlags(index: number) {
			let counter = 0;

			indexAround(index).forEach((index) => {
				if ($flag.has(index)) counter += 1;
			});

			return counter;
		}

		function digMine(index: number) {
			if (!$mask.has(index)) return;
			if ($flag.has(index)) return;

			indexes.add(index);

			mask.update((set) => {
				set.delete(index);
				return set;
			});

			if (!$hint.has(index) && !$mine.has(index)) {
				indexAround(index).forEach((index) => {
					digMine(index);
				});
			}
		}

		if (playerState !== '🙂') return;

		const indexes = new Set<number>();

		if ($mask.has(index)) {
			digMine(index);
		} else {
			if (!$hint.has(index)) return;
			if (countFlags(index) < $hint.get(index)!) return;
			indexAround(index).forEach((index) => {
				digMine(index);
			});
		}

		const newHistory: History = { event: 'Left', indexes: indexes };
		writeHistory(newHistory);
	}

	function writeHistory(newhistory: History) {
		if (newhistory.indexes.size === 0) return;

		history.set($move, newhistory);
		move.update((value) => (value += 1));
		redoLimit.update((value) => (value = $move));
	}

	function undoHistory() {
		if ($move === 0) return;

		move.update((value) => (value -= 1));
		const newHistory = history.get($move)!;
		if (newHistory.event === 'Left') {
			mask.update((set) => {
				newHistory.indexes.forEach((index) => {
					set.add(index);
				});
				return set;
			});
		} else {
			flag.update((set) => {
				newHistory.indexes.forEach((index) => {
					if (!set.delete(index)) {
						set.add(index);
					}
				});
				return set;
			});
		}
	}
	function redoHistory() {
		if ($move === $redoLimit) return;

		const newHistory = history.get($move)!;
		if (newHistory.event === 'Left') {
			mask.update((set) => {
				newHistory.indexes.forEach((index) => {
					set.delete(index);
				});
				return set;
			});
		} else {
			flag.update((set) => {
				newHistory.indexes.forEach((index) => {
					if (!set.delete(index)) {
						set.add(index);
					}
				});
				return set;
			});
		}
		move.update((value) => (value += 1));
	}

	type History = { event: 'Right' | 'Left'; indexes: Set<number> };
	type PlayerEmoji = (typeof playerEmoji)[number];

	let selectedDifficulty: (typeof difficulties)[number] = 'beginner';

	const move = writable(0);
	const redoLimit = writable(0);
	const history = new Map<number, History>();

	const playerEmoji = ['\u{1f642}', '\u{1F915}', '\u{1f60e}'] as const;
	let playerState: PlayerEmoji = '🙂';

	$: {
		$move;

		playerState = calculateStatus();
	}
	$: {
		selectedDifficulty;

		difficulty.set(difficultyPresets[selectedDifficulty]);
		clear();
	}
</script>

<!-- <button
	class=""
	on:click={() => {
		// console.log('mine', $mine);
		// console.log('mask', $mask);
		// console.log('flag', $flag);
		console.log(`${$move} / ${$redoLimit}`);
		console.log('history', history);
	}}
>
	log
</button> -->

<main class="relative flex h-full w-full flex-col items-center">
	<div class="hidden pt-14 md:block"></div>
	<section class="hidden h-fit w-[28rem] grid-cols-3 md:grid" on:input={() => {}}>
		<div class="flex flex-col">
			{#each difficulties as value}
				<label class="inline-flex items-center gap-1" for={value}>
					<input
						class="h-5 w-5 cursor-pointer accent-[hsl(96,16%,45%)]"
						type="radio"
						id={value}
						{value}
						bind:group={selectedDifficulty}
					/>
					{value}
				</label>
			{/each}
			<!-- <label for="">
				<input type="radio" name="" id="" bind:group={selectDiff} value="custom" />
				custom
			</label> -->
		</div>
		<!-- {#if selectDiff === 'custom'}
			<div class="flex flex-col space-y-2">
				<NumberInput min={10} max={30} name="col" id="col"></NumberInput>
				<NumberInput min={10} max={30} name="row" id="row"></NumberInput>
				<NumberInput min={15} max={99} name="mine" id="mine"></NumberInput>
			</div>
		{/if} -->
	</section>

	<div class="pt-10"></div>
	<section class="grid h-fit w-4/5 grid-cols-3 md:w-[28rem]">
		<p class="inline-flex items-center self-center justify-self-start align-middle">
			<span class="text-2xl">{'\u{1f6a9}'}</span>
			<span>{` ${$flag.size} / ${$difficulty.mine}`}</span>
		</p>
		<p class="self-center justify-self-center align-middle text-4xl">{playerState}</p>
		<p class="self-center justify-self-end align-middle">{`${$move} / ${$redoLimit}`}</p>
	</section>

	<div class="pt-10"></div>
	<section class="h-fit max-h-[60%] w-fit max-w-[80%] touch-auto overflow-auto rounded-lg">
		<div class="grid grid-cols-[repeat(var(--col),_2.5rem)]" style:--col={$difficulty.col}>
			{#each [...Array($difficulty.col * $difficulty.row)] as value, index}
				<Grid
					{index}
					on:click={() => {
						if ($mine.size === 0) {
							do {
								randomize();
							} while ($mine.has(index));
						}

						handleLClick(index);
					}}
					on:contextmenu={() => {
						handleRClick(index);
					}}
				></Grid>
			{/each}
		</div>
	</section>

	<div class="pt-10"></div>
	<section
		class="grid h-fit w-4/5 grid-cols-2 gap-5 md:flex md:w-[28rem] md:flex-row md:items-center md:justify-between"
	>
		<button
			class="inline-flex h-fit w-4/5 items-center justify-center place-self-center rounded-full bg-[--color] p-0.5 text-xl text-white transition-colors duration-300 md:w-fit md:hover:bg-[hsl(96,16%,45%)]"
			style:--color={$debugMode ? 'hsl(96,16%,45%)' : 'hsl(96,16%,25%)'}
			on:click={() => {
				debugMode.update((flag) => !flag);
			}}
		>
			<span
				class="h-full w-full rounded-full bg-[--color] px-5 transition-colors duration-300 hover:bg-[hsl(96,16%,25%)]"
				style:--color={$debugMode ? 'hsl(96,16%,45%)' : 'hsl(96,16%,25%)'}
			>
				Debug
			</span>
		</button>
		<MomentaryButton
			on:click={() => {
				clear();
			}}
		>
			clear
		</MomentaryButton>
		<MomentaryButton
			disabled={$move === 0}
			on:click={() => {
				undoHistory();
			}}
		>
			undo
		</MomentaryButton>
		<MomentaryButton
			disabled={$move === $redoLimit}
			on:click={() => {
				redoHistory();
			}}
		>
			redo
		</MomentaryButton>
	</section>
</main>
