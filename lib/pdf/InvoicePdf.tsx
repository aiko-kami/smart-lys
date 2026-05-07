import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12 },
	section: { marginBottom: 10 },
	title: { fontSize: 18, marginBottom: 10 },
	row: { flexDirection: "row", justifyContent: "space-between" },
});

export function InvoicePdf({ invoice, payment }: any) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Text style={styles.title}>Invoice #{invoice.number}</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.row}>
						<Text>Client</Text>
						<Text>{invoice.clientId?.name}</Text>
					</View>

					<View style={styles.row}>
						<Text>Total</Text>
						<Text>{invoice.total} €</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text>Payment status: {payment.status}</Text>
				</View>
			</Page>
		</Document>
	);
}
