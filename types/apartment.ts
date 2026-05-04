export interface ClientRef {
	_id: string;
	name: string;
}

export interface Apartment {
	_id: string;
	name: string;
	address: string;
	clientId: string | ClientRef;
	airbnbIcalUrl?: string;
	platform: "airbnb" | "other";
	description?: string;
	occupied?: boolean;
}

export interface ApartmentsClientProps {
	apartments: Apartment[];
}
