<script>
	import '../app.css';
</script>

<div
	class="relative h-fit min-h-screen w-screen overflow-x-hidden bg-black font-noto-sans font-medium text-white"
>
	<nav class="sticky left-0 top-0 z-10 flex h-10 w-full items-center justify-center bg-[#303030]">
		<div class="flex w-fit gap-5">
			<a href="/">Home</a>
			<a href="/tic-tac-toe">Tic Tac Toe</a>
			<a href="/minesweeper">Minesweeper</a>
			<!-- <a href="/snake">Snake</a> -->
			<!-- <a href="/cheese-terminator">Cheese terminator</a> -->
		</div>
	</nav>
	<slot />
</div>
