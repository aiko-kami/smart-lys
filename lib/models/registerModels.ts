import type mongoose from "mongoose";

import { getClientModel } from "./Client";
import { getApartmentModel } from "./Apartment";
import { getReservationModel } from "./Reservation";
import { getTaskModel } from "./Task";
import { getInvoiceModel } from "./Invoice";
import { getPaymentModel } from "./Payment";

export function registerModels(conn: mongoose.Connection) {
	getClientModel(conn);
	getApartmentModel(conn);
	getReservationModel(conn);
	getTaskModel(conn);
	getInvoiceModel(conn);
	getPaymentModel(conn);
}
