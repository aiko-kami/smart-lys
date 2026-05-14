export function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function formatDate(iso?: string) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function formatTodayDate() {
	return new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function formatMinutes(minutes: number) {
	if (!minutes) return "0 min";

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours > 0 && remainingMinutes > 0) {
		return `${hours}h${remainingMinutes}`;
	}

	if (hours > 0) {
		return `${hours}h`;
	}

	return `${remainingMinutes} min`;
}
