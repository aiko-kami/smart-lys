"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let width = 0;
		let height = 0;

		const letters = "アァイイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		const fontSize = 14;
		let columns = 0;
		let drops: number[] = [];

		const resize = () => {
			width = canvas.offsetWidth;
			height = canvas.offsetHeight;

			canvas.width = width;
			canvas.height = height;

			columns = Math.floor(width / fontSize);
			drops = Array(columns).fill(1);
		};

		resize();
		window.addEventListener("resize", resize);

		let animationId: number;

		const draw = () => {
			ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
			ctx.fillRect(0, 0, width, height);

			ctx.fillStyle = "#22c55e";
			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < drops.length; i++) {
				const text = letters[Math.floor(Math.random() * letters.length)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);

				if (drops[i] * fontSize > height && Math.random() > 0.975) {
					drops[i] = 0;
				}

				drops[i]++;
			}

			animationId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-20 pointer-events-none" />;
}
