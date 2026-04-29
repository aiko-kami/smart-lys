import StatsGrid from "@/components/dashboard/StatsGrid";
import TasksCard from "@/components/dashboard/TasksCard";
import ReservationsCard from "@/components/dashboard/ReservationsCard";
import ApartmentsCard from "@/components/dashboard/ApartmentsCard";

export default function HomePage() {
	return (
		<>
			<StatsGrid />
			<TasksCard />
			<section className="space-y-6 sm:grid gap-4 sm:grid-cols-2">
				<ReservationsCard />
				<ApartmentsCard />
			</section>
		</>
	);
}
