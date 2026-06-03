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
	selectedTypes: string[];

	onApartmentsChange: (ids: string[]) => void;
	onPlatformsChange: (platforms: string[]) => void;
	onTypesChange: (types: string[]) => void;
	onSelectedReservationChange: (reservation: Reservation | null) => void;
	onShowReservationDetails: (reservation: Reservation) => void;
	onModifyReservation: (reservation: Reservation) => void;
}

export default function ReservationsSidebar({
	apartments,
	reservations,
	selectedReservation,
	selectedApartments,
	selectedPlatforms,
	selectedTypes,
	onApartmentsChange,
	onPlatformsChange,
	onTypesChange,
	onSelectedReservationChange,
	onShowReservationDetails,
	onModifyReservation,
}: Props) {
	return (
		<div className="space-y-6">
			<ReservationsFilters
				apartments={apartments}
				selectedApartments={selectedApartments}
				selectedPlatforms={selectedPlatforms}
				selectedTypes={selectedTypes}
				onApartmentsChange={onApartmentsChange}
				onPlatformsChange={onPlatformsChange}
				onTypesChange={onTypesChange}
			/>

			<SelectedReservationCard selectedReservation={selectedReservation} onShowDetails={onShowReservationDetails} onModify={onModifyReservation} onClose={() => onSelectedReservationChange(null)} />

			<TodayActivities reservations={reservations} />

			<IncompleteReservations reservations={reservations} />
		</div>
	);
}
