import { connectDB } from "@/lib/mongodb";
import { getApartmentModel } from "@/lib/models";
import ApartmentsClient from "@/components/apartments/ApartmentsClient";

async function getApartments() {
	const conn = await connectDB();

	const Apartment = getApartmentModel(conn);

	const apartments = await Apartment.find();
	console.log("🚀 ~ getApartments ~ apartments:", apartments);

	return apartments;
}

export default async function ApartmentsPage() {
	const apartments = await getApartments();

	console.log("🚀 ~ ApartmentsPage ~ apartments:", apartments);

	return <ApartmentsClient apartments={apartments} />;
}
