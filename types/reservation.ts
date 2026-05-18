export interface Reservation {
	_id: string;
	apartmentId: string;
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
	cleaningFee?: number;
	cityTax?: number;
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
