"use client";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-center gap-4 p-6 text-center">
			<h1 className="text-2xl font-semibold">Ha ocurrido un error</h1>
			<p className="text-sm text-gray-600">
				{error?.message || "Se produjo un problema inesperado."}
			</p>
			<button
				type="button"
				onClick={reset}
				className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
			>
				Reintentar
			</button>
		</main>
	);
}
