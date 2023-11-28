<script lang="ts">
	export let switchState = false;
</script>

<button
	class="inline-flex gap-4"
	on:click={() => {
		switchState = !switchState;
	}}
>
	<slot name="left-text" />
	<div
		class="inline-flex h-6 w-11 rounded-full p-[2px] transition-colors duration-300"
		class:bg-gray-400={!switchState}
		class:bg-green-500={switchState}
	>
		<div
			class="h-5 w-5 rounded-full bg-white transition-transform duration-300"
			class:translate-x-full={switchState}
		/>
	</div>
	<slot name="right-text" />
</button>
