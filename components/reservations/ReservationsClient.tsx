"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import type { Reservation, Apartment, Client } from "@/types";

import ReservationsHeader from "@/components/reservations/ReservationsHeader";
import ReservationsPlanning from "@/components/reservations/ReservationsPlanning";
import ReservationsList from "@/components/reservations/ReservationsList";
import ReservationsSidebar from "@/components/reservations/ReservationsSidebar";
import ReservationDetailsModal from "@/components/reservations/modals/ReservationDetailsModal";
import ReservationFormModal from "@/components/reservations/modals/ReservationFormModal";
import DeleteReservationModal from "@/components/reservations/modals/DeleteReservationModal";

interface Props {
	reservations?: Reservation[];
	apartments?: Apartment[];
	clients?: Client[];
}

type ReservationPayload = {
	guestName: string;
	guestEmail: string;
	guestPhone: string;
	apartmentId: string | null;
	checkIn: string;
	checkOut: string;
	arrivalTime: string;
	departureTime: string;
	guests: number;
	platform: Reservation["platform"];
	totalAmount: number;
	currency: string;
	status: Reservation["status"];
	externalId: string;
	icalUid: string;
	notes: string;
	nights: number;
};

export default function ReservationsClient({ reservations: initial = [], apartments = [], clients = [] }: Props) {
	const [reservations, setReservations] = useState<Reservation[]>(initial ?? []);
	const [selectedApartments, setSelectedApartments] = useState<string[]>([]);
	const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
	const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
	const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [selectedReservationDetails, setSelectedReservationDetails] = useState<Reservation | null>(null);
	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [icalModalOpen, setIcalModalOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
	const [deleting, setDeleting] = useState(false);

	const openReservationDetails = (r: Reservation) => {
		setSelectedReservationDetails(r);
		setDetailsModalOpen(true);
	};

	function openCreateModal() {
		setEditingReservation(null);
		setFormModalOpen(true);
	}

	function openEditModal(reservation: Reservation) {
		setEditingReservation(reservation);
		setFormModalOpen(true);
	}

	const handleSaveReservation = async (formData: ReservationPayload) => {
		try {
			// ─── UPDATE ─────────────────────────────
			if (editingReservation) {
				const res = await fetch(`/api/reservations/${editingReservation._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				if (!res.ok) throw new Error("Erreur lors de la modification de la réservation");

				const updated = await res.json();
				toast.success("Réservation mise à jour");

				setReservations((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
			}

			// ─── CREATE ─────────────────────────────
			else {
				const res = await fetch("/api/reservations", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				if (!res.ok) throw new Error("Erreur lors de la création de la réservation");

				const created = await res.json();
				toast.success("Réservation créée");

				setReservations((prev) => [created, ...prev]);
			}

			setFormModalOpen(false);
			setEditingReservation(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
		}
	};

	async function handleDeleteConfirm() {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			const res = await fetch(`/api/reservations/${deleteTarget._id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Erreur lors de la suppression");
			toast.success("Réservation supprimée");
			setReservations((prev) => prev.filter((r) => r._id !== deleteTarget._id));
			setDeleteTarget(null);
			setDetailsModalOpen(false);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		} finally {
			setDeleting(false);
		}
	}

	// ── GLOBAL FILTERED DATA ───────────────

	const filteredReservations = useMemo(() => {
		return reservations.filter((reservation) => {
			const apartmentMatch = selectedApartments.length === 0 || selectedApartments.includes(reservation.apartmentId._id);

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
			<ReservationsHeader reservations={filteredReservations} onNewReservation={openCreateModal} onImportIcal={() => setIcalModalOpen(true)} />

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
				<div className="min-w-0 space-y-6">
					<ReservationsPlanning reservations={filteredReservations} apartments={visibleApartments} onReservationClick={setSelectedReservation} onReservationDoubleClick={openReservationDetails} />
					<ReservationsList reservations={filteredReservations} onReservationClick={setSelectedReservation} onShowReservationDetails={openReservationDetails} onModifyReservation={openEditModal} />
				</div>

				<ReservationsSidebar
					apartments={apartments}
					reservations={filteredReservations}
					selectedReservation={selectedReservation}
					selectedApartments={selectedApartments}
					selectedPlatforms={selectedPlatforms}
					onApartmentsChange={setSelectedApartments}
					onPlatformsChange={setSelectedPlatforms}
					onSelectedReservationChange={setSelectedReservation}
					onShowReservationDetails={openReservationDetails}
					onModifyReservation={openEditModal}
				/>
			</div>
			{/* modal Details */}
			{selectedReservationDetails && detailsModalOpen && (
				<ReservationDetailsModal
					reservation={selectedReservationDetails}
					onClose={() => setDetailsModalOpen(false)}
					onEdit={openEditModal}
					onDelete={() => setDeleteTarget(selectedReservationDetails)}
				/>
			)}

			{/* modal Form creation and edition */}
			{formModalOpen && (
				<ReservationFormModal
					reservation={editingReservation}
					clients={clients}
					apartments={apartments}
					onClose={() => {
						setFormModalOpen(false);
						setEditingReservation(null);
					}}
					onSave={handleSaveReservation}
				/>
			)}

			{/* modal Delete confirmation */}
			{deleteTarget && <DeleteReservationModal reservation={deleteTarget} deleting={deleting} onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} />}
		</div>
	);
}
