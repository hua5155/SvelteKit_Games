<button
	class="h-20 w-20 border-b-2 border-r-2 border-cyan-400 bg-black text-5xl hover:bg-[hsl(180,1%,25%)] [&:nth-child(3n)]:border-r-0 [&:nth-child(n+7)]:border-b-0"
	on:click
	on:contextmenu|preventDefault
>
	<slot />
</button>
