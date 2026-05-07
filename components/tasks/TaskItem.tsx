import { FaRegClock, FaLocationDot } from "react-icons/fa6";

export default function TaskItem() {
	return (
		<div className="border rounded-xl p-4 flex items-center justify-between hover:bg-muted/30 transition">
			<div className="flex items-center gap-4">
				<div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">🧹</div>

				<div>
					<h3 className="font-medium">Ménage complet — Appartement Riviera</h3>

					<div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">
							<FaRegClock size={14} />
							10h - 12h
						</div>

						<div className="flex items-center gap-1">
							<FaLocationDot size={14} />
							Antibes
						</div>
					</div>
				</div>
			</div>

			<div className="text-right">
				<div className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full inline-block">Haute</div>

				<p className="text-sm font-medium mt-2 text-blue-600">09:30</p>
			</div>
		</div>
	);
}
