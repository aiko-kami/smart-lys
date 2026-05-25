export function parseIcal(text: string, apartmentName: string) {
	const events: any[] = [];

	const lines = text.split(/\r?\n/);

	let current: any = null;

	for (const rawLine of lines) {
		const line = rawLine.trim();

		// ─────────────────────────────
		// START EVENT
		// ─────────────────────────────
		if (line.startsWith("BEGIN:VEVENT")) {
			current = {};
			continue;
		}

		if (!current) continue;

		// ─────────────────────────────
		// UID
		// ─────────────────────────────
		if (line.startsWith("UID:")) {
			current.uid = line.replace("UID:", "").trim();
			continue;
		}

		// ─────────────────────────────
		// TITLE
		// ─────────────────────────────
		if (line.startsWith("SUMMARY:")) {
			current.title = line.replace("SUMMARY:", "").trim();
			continue;
		}

		// ─────────────────────────────
		// START DATE
		// ─────────────────────────────
		if (line.startsWith("DTSTART")) {
			current.start = line.split(":")[1]?.trim();
			continue;
		}

		// ─────────────────────────────
		// END DATE
		// ─────────────────────────────
		if (line.startsWith("DTEND")) {
			current.end = line.split(":")[1]?.trim();
			continue;
		}

		// ─────────────────────────────
		// END EVENT
		// ─────────────────────────────
		if (line.startsWith("END:VEVENT")) {
			const title = current.title || "";

			// ❌ Ignore Airbnb blocked dates
			if (title.includes("Not available")) {
				current = null;
				continue;
			}

			// ✅ sécurité minimale
			if (current.start && current.end) {
				events.push({
					id: current.uid || crypto.randomUUID(),
					uid: current.uid || null,
					title: `${apartmentName} - ${title}`,
					start: current.start,
					end: current.end,
					type: "ical",
					apartment: apartmentName,
				});
			}

			current = null;
		}
	}

	return events;
}
