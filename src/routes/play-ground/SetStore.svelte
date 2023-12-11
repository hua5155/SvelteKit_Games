<script lang="ts">
	import { writable } from 'svelte/store';

	function createStore<Type>(initValue: Type) {
		const store = writable<Type>(initValue);

		console.log('initial value : ', initValue);

		function reset() {
			console.log('reset to : ', initValue);
			store.set(initValue);
		}

		return {
			...store,
			reset
		};
	}

	const arrayLength = 3;
	// const set = createStore(new Set<number>([1, 2, 3]));  // this reset
	// const set = createStore(new Set<number>([...Array(3).keys()]));  // this reset too
	// const set = createStore(new Set<number>([...Array(arrayLength * 1).keys()])); // this reset too
	const newSet = new Set([4, 5, 6]);

	// set.set(newSet);
	// console.log('current value : ', $set);
	// set.update((set) => {
	// 	set.add(7);
	// 	set.delete(6);
	// 	return set;
	// });
	// console.log('current value : ', $set);
	// set.reset();
	// console.log('current value : ', $set);
</script>
