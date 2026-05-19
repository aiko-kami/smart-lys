"use client";

import { useEffect, useRef, useState } from "react";

const FINAL_TEXT = "Smart Lys";

const LANGUAGES = [
	"가나다라마바사아자차카타파하ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍ",
	"アイウエオカキクケコサシスセソタチツテトナニヌネノ",
	"的一是在不了有和人这中大为上个国我以要他时来用们生到",
	"αβγδεζηθικλμνξοπστυφχψω",
];

function randomString(chars: string, len: number) {
	return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AnimatedTitle() {
	// Which language comes NEXT after the current FINAL_TEXT display
	const [langIndex, setLangIndex] = useState(0);
	// true  = currently showing / animating toward a foreign language
	// false = currently showing / animating toward FINAL_TEXT
	const [showingForeign, setShowingForeign] = useState(true);

	const [text, setText] = useState(() => randomString(LANGUAGES[0], FINAL_TEXT.length));

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const animatingRef = useRef(false);

	// Animate character-by-character toward `target`.
	// While animating, intermediate characters that haven't been "typed" yet
	// are shown as random chars from `scrambleChars` for a scramble effect.
	function animateTo(target: string, scrambleChars: string, onDone?: () => void) {
		if (intervalRef.current) clearInterval(intervalRef.current);
		animatingRef.current = true;
		let revealed = 0;

		intervalRef.current = setInterval(() => {
			revealed++;
			const scrambled = randomString(scrambleChars, Math.max(0, target.length - revealed));
			setText(target.slice(0, revealed) + scrambled);

			if (revealed >= target.length) {
				clearInterval(intervalRef.current!);
				setText(target); // ensure exact final text
				animatingRef.current = false;
				onDone?.();
			}
		}, 80);
	}

	// On mount: show Korean scramble
	useEffect(() => {
		setText(randomString(LANGUAGES[0], FINAL_TEXT.length));
	}, []);

	function handleClick() {
		if (animatingRef.current) return;

		if (showingForeign) {
			// → animate to FINAL_TEXT, scrambling with current language chars
			animateTo(FINAL_TEXT, LANGUAGES[langIndex], () => {
				setShowingForeign(false);
			});
		} else {
			// → animate to next language
			const nextIdx = (langIndex + 1) % LANGUAGES.length;
			const targetForeign = randomString(LANGUAGES[nextIdx], FINAL_TEXT.length);
			animateTo(targetForeign, LANGUAGES[nextIdx], () => {
				setLangIndex(nextIdx);
				setShowingForeign(true);
			});
		}
	}

	return (
		<h1 onClick={handleClick} className="cursor-pointer select-none text-center text-5xl font-bold tracking-wide text-white">
			<span className="font-serif inline-block min-w-[8ch] text-center">{text}</span>
		</h1>
	);
}
