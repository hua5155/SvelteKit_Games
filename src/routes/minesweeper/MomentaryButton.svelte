<script lang="ts">
	export let disabled = false;
</script>

<button
	{disabled}
	class="h-fit w-4/5 place-self-center rounded-full bg-[hsl(96,16%,25%)] px-5 pb-0.5 text-xl text-white disabled:bg-[hsl(96,16%,15%)] md:w-fit md:hover:bg-[hsl(96,16%,45%)]"
	on:click
>
	<slot />
</button>
