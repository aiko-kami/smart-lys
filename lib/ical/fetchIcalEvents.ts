import { parseIcal } from "./parseIcal";

export async function fetchIcalEvents(url: string, apartmentName: string) {
	try {
		// ─────────────────────────────
		// 1. URL validation
		// ─────────────────────────────
		if (!url || typeof url !== "string" || !url.startsWith("http")) {
			throw { code: "INVALID_URL", apartmentName, url };
		}

		// ─────────────────────────────
		// 2. Fetch iCal
		// ─────────────────────────────
		const res = await fetch(url, {
			redirect: "follow",
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept: "text/calendar,text/plain,*/*",
			},
		});

		// ⚠️ IMPORTANT: normalisation stricte HTTP
		if (!res.ok) {
			throw {
				code: `HTTP_${res.status}`,
				apartmentName,
				url,
			};
		}

		const text = await res.text();

		// ─────────────────────────────
		// 3. Validation contenu iCal
		// ─────────────────────────────
		if (!text || !/BEGIN:VEVENT/i.test(text)) {
			throw {
				code: "INVALID_ICAL_FORMAT",
				apartmentName,
				url,
			};
		}

		// ─────────────────────────────
		// 4. Parse
		// ─────────────────────────────
		return parseIcal(text, apartmentName);
	} catch (err: any) {
		console.log("🔴 fetchIcalEvents RAW ERROR:", {
			code: err?.code,
			reason: err?.reason,
			message: err?.message,
			status: err?.status,
			name: err?.name,
			full: String(err),
		});

		// ─────────────────────────────
		// 5. NORMALISATION UNIQUE (CRUCIAL)
		// ─────────────────────────────

		// ⚠️ on évite de perdre HTTP_XXX ici
		const code = err?.code || err?.reason || err?.message || "UNKNOWN_ERROR";

		throw {
			code,
			apartmentName,
			url,
		};
	}
}
