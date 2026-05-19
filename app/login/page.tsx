"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MatrixBackground from "@/components/ui/MatrixBackground";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { GrFingerPrint } from "react-icons/gr";
import { PiPawPrintBold } from "react-icons/pi";

export default function LoginPage() {
	const router = useRouter();

	const [pin, setPin] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [matrixEnabled, setMatrixEnabled] = useState(false);

	async function submit() {
		try {
			setLoading(true);
			setError("");

			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pin }),
			});

			if (!res.ok) {
				setError("PIN incorrect");
				return;
			}

			router.push("/");
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-6">
				<div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
					{/* MATRIX BACKGROUND */}
					{matrixEnabled && (
						<div className="absolute inset-0 z-0 pointer-events-none">
							<MatrixBackground />
						</div>
					)}

					{/* CONTENT */}
					<div className="relative z-10">
						<AnimatedTitle />

						<input
							type="password"
							value={pin}
							onChange={(e) => {
								setPin(e.target.value);
								setError("");
							}}
							className="w-full mt-8 mb-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
						/>

						{error && <p className="text-sm text-right pr-2 text-red-400">{error}</p>}
						<div className="mt-8 flex justify-center items-center">
							<button onClick={submit} disabled={loading} className="rounded-xl min-w-48 px-8 py-3 bg-violet-600 font-medium text-white transition hover:bg-violet-500">
								{loading ? "Connexion..." : "Entrer"}
							</button>
						</div>
					</div>
					<button
						onClick={() => setMatrixEnabled((v) => !v)}
						className="absolute bottom-2 right-1 z-20 rounded-full border border-white/10 bg-black/40 p-2 text-gray-300 backdrop-blur hover:bg-black/60 transition"
					>
						{matrixEnabled ? <GrFingerPrint /> : <PiPawPrintBold />}
					</button>
				</div>
			</div>
		</>
	);
}
