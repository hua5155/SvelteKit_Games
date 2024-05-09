<script lang="ts">
	export let value = 0;
	export let min: number;
	export let max: number;
	export let name: string;
	export let id: string;
</script>

<label class="capitalize" for={name}>
	<input
		class="h-fit w-[5ch] appearance-none rounded-md bg-[hsl(96,16%,45%)] px-2 text-right [-moz-appearance:textfield] focus:outline-none"
		type="number"
		{min}
		{max}
		{name}
		{id}
		bind:value
		on:input={() => {
			// let toNumber = parseInt(textInput.replace(/\D/, ''));
		}}
	/>
	{name}
</label>
