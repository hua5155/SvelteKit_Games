<script lang="ts">
	export let disabled = false;
</script>

<button
	{disabled}
	class="h-fit w-fit rounded-full bg-[hsl(96,16%,25%)] px-5 pb-0.5 text-xl text-white hover:bg-[hsl(96,16%,45%)] disabled:bg-[hsl(96,16%,15%)]"
	on:click
>
	<slot />
</button>
