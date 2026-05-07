import { GoDotFill } from "react-icons/go";

export default function StatusBadge({ occupied }: { occupied?: boolean }) {
	return (
		<span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${occupied ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}>
			<GoDotFill className="text-[10px]" />
			{occupied ? "Occupé" : "Disponible"}
		</span>
	);
}
