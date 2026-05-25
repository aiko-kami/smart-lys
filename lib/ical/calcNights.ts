export function calcNights(checkIn: Date, checkOut: Date) {
	const diff = checkOut.getTime() - checkIn.getTime();

	return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
