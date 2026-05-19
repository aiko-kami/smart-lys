import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Smart Lys",
	description: "Gestion de conciergerie pour locations saisonnières",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="min-h-full">
				<DashboardLayout>{children}</DashboardLayout>
				<Toaster
					position="top-right"
					toastOptions={{
						className: "",
						style: {
							borderRadius: "12px",
							background: "#333",
							color: "#fff",
							fontSize: "16px",
						},
						success: {
							style: {
								background: "#dcfce7",
								color: "#166534",
							},
						},
						error: {
							style: {
								background: "#fee2e2",
								color: "#7f1d1d",
							},
						},
						duration: 3000,
					}}
					gutter={12}
				/>
			</body>
		</html>
	);
}
