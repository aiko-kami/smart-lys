"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonColor = "gray" | "blue" | "green" | "red" | "pink" | "orange" | "yellow" | "gradientBluePurple" | "gradientPurplePink" | "grayOutline";

type ButtonSize = "xs" | "sm" | "std" | "xl" | "2xl" | "3xl" | "lg" | "sm-std" | "std-xl";

type ButtonRounded = "none" | "sm" | "std" | "lg" | "xl" | "full";

interface BaseButtonProps {
	btnSize?: ButtonSize;
	btnColor?: ButtonColor;
	btnRounded?: ButtonRounded;
	wFull?: boolean;
	action?: () => void;
	disabled?: boolean;
	title?: string;
}

interface ButtonProps extends BaseButtonProps {
	children: ReactNode;
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	name?: string;
	value?: string;
}

function getButtonClasses(color: ButtonColor = "blue", disabled: boolean = false): string {
	const COLORS = {
		gray: {
			text: "text-white",
			base: "bg-gray-500",
			hover: "hover:bg-gray-600",
			active: "active:bg-gray-800",
			disabled: { base: "bg-gray-500 opacity-40" },
		},
		blue: {
			text: "text-white",
			base: "bg-blue-600",
			hover: "hover:bg-blue-700",
			active: "active:bg-blue-800",
			disabled: { base: "bg-blue-600 opacity-40" },
		},
		green: {
			text: "text-white",
			base: "bg-green-600",
			hover: "hover:bg-green-700",
			active: "active:bg-green-800",
			disabled: { base: "bg-green-600 opacity-40" },
		},
		red: {
			text: "text-white",
			base: "bg-red-600",
			hover: "hover:bg-red-700",
			active: "active:bg-red-800",
			disabled: { base: "bg-red-600 opacity-40" },
		},
		pink: {
			text: "text-white",
			base: "bg-pink-400",
			hover: "hover:bg-pink-500",
			active: "active:bg-pink-700",
			disabled: { base: "bg-pink-400 opacity-40" },
		},
		orange: {
			text: "text-white",
			base: "bg-orange-600",
			hover: "hover:bg-orange-700",
			active: "active:bg-orange-800",
			disabled: { base: "bg-orange-600 opacity-40" },
		},
		yellow: {
			text: "text-white",
			base: "bg-yellow-500",
			hover: "hover:bg-yellow-600",
			active: "active:bg-yellow-700",
			disabled: { base: "bg-yellow-500 opacity-40" },
		},
		gradientBluePurple: {
			text: "text-white",
			base: "bg-gradient-to-r from-blue-600 to-indigo-600",
			hover: "hover:from-blue-700 hover:to-indigo-700",
			active: "active:from-blue-800 active:to-indigo-800",
			disabled: { base: "bg-indigo-600 opacity-40" },
			shadow: "shadow-2xl shadow-blue-500/25",
		},
		gradientPurplePink: {
			text: "text-white",
			base: "bg-gradient-to-r from-purple-600 to-pink-600",
			hover: "hover:from-purple-700 hover:to-pink-700",
			active: "active:from-purple-800 active:to-pink-800",
			disabled: { base: "bg-pink-600 opacity-40" },
			shadow: "shadow-2xl shadow-purple-500/25",
		},
		grayOutline: {
			text: "text-white",
			base: "",
			hover: "hover:bg-slate-600",
			active: "active:bg-slate-700",
			border: "border border-2 box-border border-slate-600",
			disabled: {
				text: "text-gray-900",
				base: "bg-slate-200 opacity-40",
				border: "border border-2 box-border border-slate-300",
			},
		},
	};

	const c = COLORS[color] || COLORS.blue;

	if (disabled) {
		return [c.disabled?.text ?? c.text, c.disabled?.base ?? c.base, c.disabled?.border ?? c.border, "opacity-40 cursor-not-allowed"].filter(Boolean).join(" ");
	}

	return [c.text, c.base, c.border, c.hover, c.active, c.shadow].filter(Boolean).join(" ");
}

export function Button({ children, btnSize = "std", btnColor = "blue", btnRounded = "std", wFull = false, action = () => {}, type = "button", name, value, disabled = false }: ButtonProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs px-3 py-1.5",
		sm: "text-sm font-medium px-3 py-2",
		std: "text-base px-4 py-2",
		xl: "text-xl px-4 py-2.5",
		"2xl": "text-2xl px-4 pb-3 pt-2.5",
		"3xl": "text-3xl px-7 pb-5 pt-3 m-4",
		lg: "text-lg px-12 py-4 font-semibold",
		"sm-std": "text-sm font-medium px-3 py-2 md:text-base md:px-4",
		"std-xl": "text-base sm:text-xl py-2 px-2",
	};

	const roundedMap: Record<ButtonRounded, string> = {
		none: "rounded-none",
		sm: "rounded-sm",
		std: "rounded",
		lg: "rounded-lg",
		xl: "rounded-xl",
		full: "rounded-full",
	};

	return (
		<button
			type={type}
			onClick={action}
			name={name}
			value={value}
			disabled={disabled}
			className={`leading-snug text-nowrap shadow-lg transition-all duration-150 ease-in-out ${sizeMap[btnSize]} ${roundedMap[btnRounded]} ${wFull ? "w-full" : ""} ${getButtonClasses(btnColor, disabled)}`}
		>
			{children}
		</button>
	);
}

export function ButtonCircle({ children, btnSize = "std", btnColor = "blue", action = () => {}, type = "button", name, value, disabled = false, title }: ButtonProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-2.5 px-2.5",
		sm: "text-sm py-2 px-2",
		std: "text-base py-2 px-2",
		xl: "text-xl py-2 px-2",
		"2xl": "text-2xl py-2 px-2",
		"3xl": "text-2xl py-2 px-2",
		lg: "text-xl py-2 px-2",
		"sm-std": "text-base py-2 px-2",
		"std-xl": "text-base sm:text-xl py-2 px-2",
	};

	return (
		<button
			type={type}
			onClick={action}
			name={name}
			value={value}
			disabled={disabled}
			title={title}
			className={`rounded-full leading-snug transition duration-150 ease-in-out hover:shadow-lg ${sizeMap[btnSize]} ${getButtonClasses(btnColor, disabled)}`}
		>
			{children}
		</button>
	);
}
