<script context="module" lang="ts">
	import { createStore } from '$lib/store';
	import { derived, get, readable, readonly, writable } from 'svelte/store';

	const difficulties = {
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

	const debugMode = writable(true);
	export const readDebugMode = readonly(debugMode);

	const difficulty = writable(difficulties.beginner);
	const mine = writable(new Set<number>());
	const mask = writable(
		new Set<number>([...Array(get(difficulty).col * get(difficulty).row).keys()])
	);
	const flag = writable(new Set<number>());
	const hint = writable(new Map<number, number>());

	export const readDifficulty = readonly(difficulty);
	export const readMine = readonly(mine);
	export const readMask = readonly(mask);
	export const readFlag = readonly(flag);
	export const readHint = readonly(hint);
</script>

<script lang="ts">
	import Grid from './Grid.svelte';

	function init() {
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

		move.reset();
		history.clear();
		flag.update((set) => {
			set.clear();
			return set;
		});
		mask.update((set) => {
			[...Array($difficulty.col * $difficulty.row).keys()].forEach((index) => {
				set.add(index);
			});
			return set;
		});
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

		$mine.forEach((index) => {
			if (!$mask.has(index)) console.log('YOU DIED');
		});

		if (compareSet($mine, $mask)) {
			console.log('YOU WIN');
			flag.set(new Set([...$mask]));
		}
	}

	function handleRClick(index: number) {
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

		const indexes = new Set([index]);

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

	type ClickEvent = 'Right' | 'Left';
	type History = { event: ClickEvent; indexes: Set<number> };

	const move = createStore(0);
	const redoLimit = createStore(0);
	const history = new Map<number, History>();

	$: {
		$mask;

		calculateStatus();
	}
</script>

<button
	class=""
	on:click={() => {
		init();
	}}
>
	init
</button>
<button
	class=""
	class:text-green-500={$debugMode}
	on:click={() => {
		debugMode.update((flag) => !flag);
	}}
>
	debugMode
</button>
<button
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
</button>
<button
	class=""
	on:click={() => {
		undoHistory();
	}}
>
	undo
</button>
<button
	class=""
	on:click={() => {
		redoHistory();
	}}
>
	redo
</button>

<section
	class="grid h-fit w-fit grid-cols-[repeat(var(--col),_minmax(0,_1fr))] gap-0"
	style:--col={$difficulty.col}
>
	{#each [...Array($difficulty.col * $difficulty.row)] as value, index}
		<Grid
			{index}
			on:click={() => {
				handleLClick(index);
			}}
			on:contextmenu={() => {
				handleRClick(index);
			}}
		></Grid>
	{/each}
</section>
