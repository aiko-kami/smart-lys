import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AllLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
