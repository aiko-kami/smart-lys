export interface Reservation {
	_id: string;
	apartmentId: {
		_id: string;
		name: string;
		image: string;
		address: string;
		clientId: string;
	};
	guestName?: string;
	guestEmail?: string;
	guestPhone?: string;
	checkIn: string;
	checkOut: string;
	nights?: number;
	guests?: number;
	platform: "airbnb" | "booking" | "direct" | "other";
	externalId?: string;
	icalUid?: string;
	totalAmount?: number;
	currency?: string;
	status: "pending" | "confirmed" | "cancelled" | "completed";
	notes?: string;
	arrivalTime?: string;
	departureTime?: string;
	isCompleted?: boolean;
	isArchived?: boolean;
	isImported?: boolean;
	isIncomplete?: boolean;
	lastSyncAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type ReservationPayload = {
	guestName: string;
	guestEmail: string;
	guestPhone: string;

	apartmentId: string | null;

	checkIn: string;
	checkOut: string;
	nights: number;

	arrivalTime: string;
	departureTime: string;

	guests: number;

	platform: "airbnb" | "booking" | "direct" | "other";
	status: "pending" | "confirmed" | "cancelled" | "completed";

	totalAmount: number;
	currency: string;

	externalId: string;
	icalUid: string;
	notes: string;
};
