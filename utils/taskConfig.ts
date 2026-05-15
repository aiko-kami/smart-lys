// utils/taskConfig.ts

import { LiaBroomSolid, LiaClipboardCheckSolid, LiaExpandSolid, LiaSignInAltSolid, LiaSignOutAltSolid, LiaToolsSolid } from "react-icons/lia";

import { LuUserRound, LuRefreshCw, LuCircleCheck, LuCircleX, LuTimer } from "react-icons/lu";

export const taskTypeConfig = {
	cleaning: {
		icon: LiaBroomSolid,
		bg: "bg-blue-100",
		color: "text-blue-600",
		line: "from-blue-500 to-cyan-400",
		dot: "bg-blue-500",
		label: "Nettoyage",
	},

	checkin: {
		icon: LiaSignInAltSolid,
		bg: "bg-green-100",
		color: "text-green-600",
		line: "from-green-500 to-teal-500",
		dot: "bg-green-500",
		label: "Accueil voyageurs",
	},

	checkout: {
		icon: LiaSignOutAltSolid,
		bg: "bg-orange-100",
		color: "text-orange-600",
		line: "from-orange-500 to-amber-400",
		dot: "bg-orange-500",
		label: "Départ voyageurs",
	},

	maintenance: {
		icon: LiaToolsSolid,
		bg: "bg-red-100",
		color: "text-red-600",
		line: "from-red-500 to-pink-500",
		dot: "bg-red-500",
		label: "Maintenance",
	},

	inspection: {
		icon: LiaClipboardCheckSolid,
		bg: "bg-purple-100",
		color: "text-purple-600",
		line: "from-purple-500 to-indigo-500",
		dot: "bg-purple-500",
		label: "Inspection",
	},

	chloe: {
		icon: LuUserRound,
		bg: "bg-pink-100",
		color: "text-pink-600",
		line: "from-pink-500 to-rose-400",
		dot: "bg-pink-500",
		label: "Chloé",
	},

	amy: {
		icon: LuUserRound,
		bg: "bg-fuchsia-100",
		color: "text-fuchsia-600",
		line: "from-fuchsia-500 to-purple-400",
		dot: "bg-fuchsia-500",
		label: "Amy",
	},

	adrian: {
		icon: LuUserRound,
		bg: "bg-cyan-100",
		color: "text-cyan-600",
		line: "from-cyan-500 to-blue-500",
		dot: "bg-cyan-500",
		label: "Adrian",
	},

	other: {
		icon: LiaExpandSolid,
		bg: "bg-gray-200",
		color: "text-gray-600",
		line: "from-gray-500 to-gray-600",
		dot: "bg-gray-500",
		label: "Autre",
	},
} as const;

export const priorityConfig = {
	low: {
		bg: "bg-emerald-100",
		text: "text-emerald-600",
		label: "Basse",
	},

	medium: {
		bg: "bg-orange-100",
		text: "text-orange-600",
		label: "Moyenne",
	},

	high: {
		bg: "bg-rose-100",
		text: "text-rose-600",
		label: "Haute",
	},

	"N/A": {
		bg: "",
		text: "",
		label: "",
	},
} as const;

export const statusConfig = {
	pending: {
		icon: LuTimer,
		color: "text-amber-600",
		bg: "bg-amber-100",
		label: "Tâche à faire",
		labelShort: "À faire",
	},

	"in progress": {
		icon: LuRefreshCw,
		color: "text-teal-600",
		bg: "bg-teal-100",
		label: "Tâche en cours",
		labelShort: "En cours",
	},

	done: {
		icon: LuCircleCheck,
		color: "text-green-600",
		bg: "bg-green-100",
		label: "Tâche terminée",
		labelShort: "Terminée",
	},

	cancelled: {
		icon: LuCircleX,
		color: "text-red-600",
		bg: "bg-red-100",
		label: "Tâche annulée",
		labelShort: "Annulée",
	},
} as const;
