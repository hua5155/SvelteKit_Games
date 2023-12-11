<script lang="ts">
	const set = new Set<number>();
	let counter = 0;

	$: {
		// This won't trigger reactivity.
		// set;
		// console.log('Reactivity!');

		// Need a key like "counter" to trigger reactivity
		counter;
		console.log('values : ', [...set]);
	}
</script>

<h1>SetReactivity</h1>

<div class="flex gap-5">
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			set.add(counter);
			counter += 1;
		}}
	>
		Increment count
	</button>
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			set.clear();
			counter = 0;
		}}
	>
		Reset map
	</button>
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			console.log('values : ', [...set]);
		}}
	>
		Console log
	</button>
</div>

<div>
	{#key counter}
		<p>{`Set : ${[...set]}`}</p>
	{/key}
</div>
