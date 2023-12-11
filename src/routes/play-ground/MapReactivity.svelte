<script lang="ts">
	const map = new Map<number, string>();
	let counter = 0;

	$: {
		// This won't trigger reactivity.
		// map;
		// console.log('Reactivity!');

		// Need a key like "counter" to trigger reactivity
		counter;
		const values = map.values();
		console.log('values : ', [...values]);
	}
</script>

<h1>MapReactivity</h1>

<div class="flex gap-5">
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			map.set(counter, 'value');
			counter += 1;
		}}
	>
		Increment count
	</button>
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			map.clear();
			counter = 0;
		}}
	>
		Reset map
	</button>
	<button
		class="rounded-full bg-[hsl(96,16%,25%)] px-5 pb-2 pt-1 hover:bg-[hsl(96,16%,45%)]"
		on:click={() => {
			const values = map.values();
			console.log('values : ', [...values]);
		}}
	>
		Console log
	</button>
</div>

<ul>
	{#key counter}
		{#each map as value}
			<li>{`${value[0]} : ${value[1]}`}</li>
		{/each}
	{/key}
</ul>
