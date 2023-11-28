<script lang="ts">
	type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
	type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
		TObj,
		Exclude<keyof TObj, ArrayLengthMutationKeys>
	> & {
		readonly length: L;
		[I: number]: T;
		[Symbol.iterator]: () => IterableIterator<T>;
	};

	type mapTemplate = FixedLengthArray<string, 3>;
	const map = new Map<number, mapTemplate>().set(0, ['', '', '']);
	map.set(1, ['1', '2', '3']);
	// map.set(2, ['a']) // intellisense could be better
</script>

<h1>fixed length array</h1>
