import { FaAirbnb } from "react-icons/fa6";

export default function PlatformIcon({ platform }: { platform: "airbnb" | "other" }) {
	if (platform === "airbnb") {
		return (
			<>
				<FaAirbnb className="mt-0.5 mr-1 shrink-0 text-xl text-[#FF385C]" title="Airbnb" />
				<span className="text-base">Airbnb</span>
			</>
		);
	}
	return <span className="text-gray-400">Autre</span>;
}
