import { FaAirbnb, FaHandshakeSimple } from "react-icons/fa6";
import { BsChatDotsFill } from "react-icons/bs";
import { SiBookingdotcom } from "react-icons/si";

export const AVATAR_BG = [
	"bg-blue-500/20 text-blue-400",
	"bg-teal-500/20 text-teal-400",
	"bg-amber-500/20 text-amber-400",
	"bg-purple-500/20 text-purple-400",
	"bg-pink-500/20 text-pink-400",
	"bg-green-500/20 text-green-400",
];

export const INPUT_CLASS = "w-full rounded-xl border border-white/10 bg-[#1a2438] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500";

export const PLATFORMS = [
	{ value: "airbnb", label: "Airbnb", icon: FaAirbnb, color: "#FF385C", bg: "#4A1D26", borderColor: "#FF385C" },
	{ value: "booking", label: "Booking", icon: SiBookingdotcom, color: "#084198", bg: "#142e5e", borderColor: "#084198" },
	{ value: "direct", label: "Direct", icon: FaHandshakeSimple, color: "#FFFF", bg: "#1F4B3A", borderColor: "#1DBF8A" },
	{ value: "other", label: "Autre", icon: BsChatDotsFill, color: "#E5E3C9", bg: "#3F4452", borderColor: "#888888" },
] as const;
