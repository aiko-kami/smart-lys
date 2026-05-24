"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { LuTrash2, LuPencil } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";

type ButtonColor = "gray" | "blue" | "green" | "red" | "pink" | "orange" | "yellow" | "gradientBluePurple" | "gradientPurplePink" | "grayOutline";

type ButtonSize = "xs" | "sm" | "std" | "lg" | "xl" | "2xl" | "3xl";

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

interface ButtonActionsProps {
	btnSize?: ButtonSize;
	action?: () => void;
	disabled?: boolean;
	iconOnly?: boolean;
}

/* ─────────────────────────────────────────────
   TYPES SAFE COLOR SYSTEM
──────────────────────────────────────────── */

type ColorStyle = {
	text?: string;
	base: string;
	hover?: string;
	active?: string;
	border?: string;
	shadow?: string;
};

const COLORS: Record<ButtonColor, { normal: ColorStyle; disabled: ColorStyle }> = {
	gray: {
		normal: {
			text: "text-white",
			base: "bg-gray-500",
			hover: "hover:bg-gray-600",
			active: "active:bg-gray-800",
		},
		disabled: {
			text: "text-white",
			base: "bg-gray-500 opacity-40",
		},
	},

	blue: {
		normal: {
			text: "text-white",
			base: "bg-blue-600",
			hover: "hover:bg-blue-700",
			active: "active:bg-blue-800",
		},
		disabled: {
			text: "text-white",
			base: "bg-blue-600 opacity-40",
		},
	},

	green: {
		normal: {
			text: "text-white",
			base: "bg-green-600",
			hover: "hover:bg-green-700",
			active: "active:bg-green-800",
		},
		disabled: {
			text: "text-white",
			base: "bg-green-600 opacity-40",
		},
	},

	red: {
		normal: {
			text: "text-white",
			base: "bg-red-600",
			hover: "hover:bg-red-700",
			active: "active:bg-red-800",
		},
		disabled: {
			text: "text-white",
			base: "bg-red-600 opacity-40",
		},
	},

	pink: {
		normal: {
			text: "text-white",
			base: "bg-pink-400",
			hover: "hover:bg-pink-500",
			active: "active:bg-pink-700",
		},
		disabled: {
			text: "text-white",
			base: "bg-pink-400 opacity-40",
		},
	},

	orange: {
		normal: {
			text: "text-white",
			base: "bg-orange-600",
			hover: "hover:bg-orange-700",
			active: "active:bg-orange-800",
		},
		disabled: {
			text: "text-white",
			base: "bg-orange-600 opacity-40",
		},
	},

	yellow: {
		normal: {
			text: "text-white",
			base: "bg-yellow-500",
			hover: "hover:bg-yellow-600",
			active: "active:bg-yellow-700",
		},
		disabled: {
			text: "text-white",
			base: "bg-yellow-500 opacity-40",
		},
	},

	gradientBluePurple: {
		normal: {
			text: "text-white",
			base: "bg-gradient-to-r from-blue-600 to-indigo-600",
			hover: "hover:from-blue-700 hover:to-indigo-700",
			active: "active:from-blue-800 active:to-indigo-800",
			shadow: "shadow-2xl shadow-blue-500/25",
		},
		disabled: {
			text: "text-white",
			base: "bg-indigo-600 opacity-40",
		},
	},

	gradientPurplePink: {
		normal: {
			text: "text-white",
			base: "bg-gradient-to-r from-purple-600 to-pink-600",
			hover: "hover:from-purple-700 hover:to-pink-700",
			active: "active:from-purple-800 active:to-pink-800",
			shadow: "shadow-2xl shadow-purple-500/25",
		},
		disabled: {
			text: "text-white",
			base: "bg-pink-600 opacity-40",
		},
	},

	grayOutline: {
		normal: {
			text: "text-white",
			base: "bg-transparent",
			border: "border border-slate-600",
			hover: "hover:bg-slate-600",
			active: "active:bg-slate-700",
		},
		disabled: {
			text: "text-gray-400",
			base: "bg-slate-200 opacity-40",
			border: "border border-slate-300",
		},
	},
};

/* ─────────────────────────────────────────────
   SAFE CLASS BUILDER
──────────────────────────────────────────── */

function getButtonClasses(color: ButtonColor = "blue", disabled = false): string {
	const set = COLORS[color];

	const style = disabled ? set.disabled : set.normal;

	return [style.text, style.base, style.border, style.hover, style.active, style.shadow, disabled ? "opacity-40 cursor-not-allowed" : ""].filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────
   BUTTON
──────────────────────────────────────────── */

export function Button({ children, btnSize = "std", btnColor = "blue", btnRounded = "std", wFull = false, action = () => {}, type = "button", name, value, disabled = false }: ButtonProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs px-3 py-1.5",
		sm: "text-sm font-medium px-3 py-2",
		std: "text-base px-4 py-2",
		lg: "text-lg px-12 py-4 font-semibold",
		xl: "text-xl px-4 py-2.5",
		"2xl": "text-2xl px-4 pb-3 pt-2.5",
		"3xl": "text-3xl px-7 pb-5 pt-3 m-4",
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
			className={[
				"leading-snug text-nowrap shadow-lg transition-all duration-150 ease-in-out",
				sizeMap[btnSize],
				roundedMap[btnRounded],
				wFull ? "w-full" : "",
				getButtonClasses(btnColor, disabled),
			].join(" ")}
		>
			{children}
		</button>
	);
}

/* ─────────────────────────────────────────────
   CIRCLE BUTTON
──────────────────────────────────────────── */

export function ButtonCircle({ children, btnSize = "std", btnColor = "blue", action = () => {}, type = "button", name, value, disabled = false, title }: ButtonProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-2.5 px-2.5",
		sm: "text-sm py-2 px-2",
		std: "text-base py-2 px-2",
		lg: "text-xl py-2 px-2",
		xl: "text-xl py-2 px-2",
		"2xl": "text-2xl py-2 px-2",
		"3xl": "text-2xl py-2 px-2",
	};

	return (
		<button
			type={type}
			onClick={action}
			name={name}
			value={value}
			disabled={disabled}
			title={title}
			className={["rounded-full leading-snug transition duration-150 ease-in-out hover:shadow-lg", sizeMap[btnSize], getButtonClasses(btnColor, disabled)].join(" ")}
		>
			{children}
		</button>
	);
}

/* ─────────────────────────────────────────────
   ACTIONS BUTTONS
──────────────────────────────────────────── */

export function RemoveButton({ btnSize = "std", action = () => {}, disabled = false, iconOnly = false }: ButtonActionsProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-1.5 px-1.5 rounded-lg",
		sm: "text-sm py-2 px-2 rounded-lg",
		std: "text-base py-2 px-2 rounded-lg",
		lg: "text-lg py-2 px-2 rounded-lg",
		xl: "text-xl py-2 px-2 rounded-xl",
		"2xl": "text-2xl py-2 px-2 rounded-xl",
		"3xl": "text-3xl py-2 px-2 rounded-xl",
	};

	const sizeIconMap: Record<ButtonSize, number> = {
		xs: 14,
		sm: 14,
		std: 16,
		lg: 18,
		xl: 20,
		"2xl": 22,
		"3xl": 24,
	};

	return (
		<button
			onClick={action}
			disabled={disabled}
			className={["flex w-full items-center justify-center gap-1.5 text-red-400 bg-red-600/10 border border-red-500/20 transition hover:bg-red-500/20", sizeMap[btnSize]].join(" ")}
		>
			<LuTrash2 size={sizeIconMap[btnSize]} />
			{!iconOnly && "Supprimer"}
		</button>
	);
}

export function EditButton({ btnSize = "std", action = () => {}, disabled = false, iconOnly = false }: ButtonActionsProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-1.5 px-1.5 rounded-lg",
		sm: "text-sm py-2 px-2 rounded-lg",
		std: "text-base py-2 px-2 rounded-lg",
		lg: "text-lg py-2 px-2 rounded-lg",
		xl: "text-xl py-2 px-2 rounded-xl",
		"2xl": "text-2xl py-2 px-2 rounded-xl",
		"3xl": "text-3xl py-2 px-2 rounded-xl",
	};

	const sizeIconMap: Record<ButtonSize, number> = {
		xs: 14,
		sm: 14,
		std: 16,
		lg: 18,
		xl: 20,
		"2xl": 22,
		"3xl": 24,
	};

	return (
		<button
			onClick={action}
			disabled={disabled}
			className={["flex w-full items-center justify-center gap-1.5 text-violet-400 bg-violet-600/10 border border-violet-500/20 transition hover:bg-violet-500/20", sizeMap[btnSize]].join(" ")}
		>
			<LuPencil size={sizeIconMap[btnSize]} />
			{!iconOnly && "Éditer"}
		</button>
	);
}

export function CloseButton({ btnSize = "std", action = () => {}, disabled = false, iconOnly = false }: ButtonActionsProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-1.5 px-1.5 rounded-lg",
		sm: "text-sm py-2 px-2 rounded-lg",
		std: "text-base py-2 px-2 rounded-lg",
		lg: "text-lg py-2 px-2 rounded-lg",
		xl: "text-xl py-2 px-2 rounded-xl",
		"2xl": "text-2xl py-2 px-2 rounded-xl",
		"3xl": "text-3xl py-2 px-2 rounded-xl",
	};

	return (
		<button
			onClick={action}
			disabled={disabled}
			className={["flex w-full items-center justify-center gap-1.5 text-gray-400 bg-gray-600/10 border border-gray-500/20 transition hover:bg-gray-500/20", sizeMap[btnSize]].join(" ")}
		>
			{!iconOnly && "Fermer"}
		</button>
	);
}

export function ViewButton({ btnSize = "std", action = () => {}, disabled = false, iconOnly = false }: ButtonActionsProps) {
	const sizeMap: Record<ButtonSize, string> = {
		xs: "text-xs py-1.5 px-1.5 rounded-lg",
		sm: "text-sm py-2 px-2 rounded-lg",
		std: "text-base py-2 px-2 rounded-lg",
		lg: "text-lg py-2 px-2 rounded-lg",
		xl: "text-xl py-2 px-2 rounded-xl",
		"2xl": "text-2xl py-2 px-2 rounded-xl",
		"3xl": "text-3xl py-2 px-2 rounded-xl",
	};

	const sizeIconMap: Record<ButtonSize, number> = {
		xs: 14,
		sm: 14,
		std: 16,
		lg: 18,
		xl: 20,
		"2xl": 22,
		"3xl": 24,
	};

	return (
		<button
			onClick={action}
			disabled={disabled}
			className={["flex w-full items-center justify-center gap-1.5 text-emerald-400 bg-emerald-600/10 border border-emerald-500/20 transition hover:bg-emerald-500/20", sizeMap[btnSize]].join(" ")}
		>
			<IoEyeOutline size={sizeIconMap[btnSize]} />
			{!iconOnly && "Voir"}
		</button>
	);
}
