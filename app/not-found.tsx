import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
			<h1 className="text-2xl font-semibold">Página no encontrada</h1>
			<p className="text-sm text-zinc-600">
				La ruta que intentas abrir no existe.
			</p>
			<Link
				href="/"
				className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
			>
				Volver al inicio
			</Link>
		</main>
	);
}
