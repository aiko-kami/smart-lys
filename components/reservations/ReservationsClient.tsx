"use client";

import { useMemo, useState } from "react";

import type { Reservation, Apartment } from "@/types";

import ReservationsHeader from "./ReservationsHeader";
import ReservationsPlanning from "./ReservationsPlanning";
import ReservationsList from "./ReservationsList";
import ReservationsSidebar from "./ReservationsSidebar";

interface Props {
	reservations?: Reservation[];
	apartments?: Apartment[];
}

export default function ReservationsClient({ reservations: initial = [], apartments = [] }: Props) {
	const [reservations, setReservations] = useState<Reservation[]>(initial ?? []);
	const [selectedApartments, setSelectedApartments] = useState<string[]>([]);
	const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
	const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [icalModalOpen, setIcalModalOpen] = useState(false);

	// ── GLOBAL FILTERED DATA ───────────────

	const filteredReservations = useMemo(() => {
		return reservations.filter((reservation) => {
			const apartmentMatch = selectedApartments.length === 0 || selectedApartments.includes(String(reservation.apartmentId));

			const platformMatch = selectedPlatforms.length === 0 || selectedPlatforms.includes(reservation.platform);

			return apartmentMatch && platformMatch;
		});
	}, [reservations, selectedApartments, selectedPlatforms]);

	const visibleApartments = useMemo(() => {
		if (selectedApartments.length === 0) return apartments;
		return apartments.filter((a) => selectedApartments.includes(a._id));
	}, [apartments, selectedApartments]);

	return (
		<div className="space-y-6">
			<ReservationsHeader reservations={filteredReservations} onNewReservation={() => setFormModalOpen(true)} onImportIcal={() => setIcalModalOpen(true)} />

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
				<div className="space-y-6">
					<ReservationsPlanning reservations={filteredReservations} apartments={visibleApartments} onReservationClick={setSelectedReservation} />

					<ReservationsList reservations={filteredReservations} onReservationClick={setSelectedReservation} />
				</div>

				<ReservationsSidebar
					apartments={apartments}
					reservations={filteredReservations}
					selectedReservation={selectedReservation}
					selectedApartments={selectedApartments}
					selectedPlatforms={selectedPlatforms}
					onApartmentsChange={setSelectedApartments}
					onPlatformsChange={setSelectedPlatforms}
				/>
			</div>
		</div>
	);
}
