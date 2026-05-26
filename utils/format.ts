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

export function formatTimeAgo(date: Date | string | null | undefined) {
	if (!date) return "jamais";

	const d = new Date(date);
	if (isNaN(d.getTime())) return "jamais";

	const now = new Date();
	const diffMs = now.getTime() - d.getTime();

	const diffMin = Math.floor(diffMs / 60000);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffMin < 1) return "à l’instant";
	if (diffMin < 60) return `il y a ${diffMin} min`;
	if (diffHour < 24) return `il y a ${diffHour} h`;
	return `il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;
}
