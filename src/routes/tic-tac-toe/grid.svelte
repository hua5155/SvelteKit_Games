<script lang="ts">
	export let value = '';
</script>

<div class="group">
	<div class="inline-flex h-fit w-fit">
		<button class="h-20 w-20 bg-gray-600 hover:bg-gray-800" on:click>
			{value}
		</button>
		<div class="h-20 w-1 bg-white group-[:nth-child(3n)]:hidden"></div>
	</div>
	<div class="h-1 w-full bg-white group-[:nth-child(n+7)]:hidden group-[:nth-child(3n)]:w-20"></div>
</div>
