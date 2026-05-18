"use client";

import type { Apartment, Reservation } from "@/types";

import ReservationsFilters from "@/components/reservations/reservationsSidebar/ReservationsFilters";
import SelectedReservationCard from "@/components/reservations/reservationsSidebar/SelectedReservationCard";
import TodayActivities from "@/components/reservations/reservationsSidebar/TodayActivities";
import IncompleteReservations from "@/components/reservations/reservationsSidebar/IncompleteReservations";

interface Props {
	apartments: Apartment[];
	reservations: Reservation[];

	selectedReservation: Reservation | null;
	selectedApartments: string[];
	selectedPlatforms: string[];

	onApartmentsChange: (ids: string[]) => void;
	onPlatformsChange: (platforms: string[]) => void;
}

export default function ReservationsSidebar({ apartments, reservations, selectedReservation, selectedApartments, selectedPlatforms, onApartmentsChange, onPlatformsChange }: Props) {
	return (
		<div className="space-y-6">
			<ReservationsFilters
				apartments={apartments}
				selectedApartments={selectedApartments}
				selectedPlatforms={selectedPlatforms}
				onApartmentsChange={onApartmentsChange}
				onPlatformsChange={onPlatformsChange}
			/>

			<SelectedReservationCard selectedReservation={selectedReservation} />

			<TodayActivities reservations={reservations} />

			<IncompleteReservations reservations={reservations} />
		</div>
	);
}
