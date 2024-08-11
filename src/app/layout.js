import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/services/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "PantryPal",
	description: "Pantry Management Dashboard",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}