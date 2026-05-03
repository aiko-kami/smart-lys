export interface Client {
	_id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	description?: string;
	startDate?: string;
}

export interface ClientsClientProps {
	clients: Client[];
}
