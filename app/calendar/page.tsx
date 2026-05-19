import StatsGrid from "@/components/dashboard/StatsGrid";
import TasksCard from "@/components/dashboard/TasksCard";

export const dynamic = "force-dynamic";

export default function Calendar() {
	return (
		<>
			hello calendrier
			<StatsGrid />
			<TasksCard />
		</>
	);
}
