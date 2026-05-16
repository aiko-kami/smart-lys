export interface Payment {
	_id?: string;
	name: string;
	bank: string;
	iban: string;
	bic: string;
	description: string;
	paymentTerms: string;
}
