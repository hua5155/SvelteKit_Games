<script>
	import '../app.css';
</script>

<div
	class="font-noto-sans relative h-fit min-h-screen w-screen max-w-full bg-black font-medium text-white"
>
	<nav class="sticky left-0 top-0 flex h-10 w-full items-center justify-center bg-[#303030]">
		<div class="flex w-fit gap-5">
			<a href="/tic-tac-toe">Tic Tac Toe</a>
			<a href="/minesweeper">Minesweeper</a>
			<a href="/snake">Snake</a>
			<a href="/cheese-terminator">Cheese terminator</a>
		</div>
	</nav>
	<slot />
</div>
