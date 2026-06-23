import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

function fmt(n: number) {
	return n.toLocaleString("fr-FR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function fmtDate(d: string | Date) {
	return new Date(d).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export function InvoicePdf({ invoice, payment, logoBase64 }: any) {
	const BLUE = "rgb(0, 114, 200)";
	const BLUE_LIGHT = "rgb(112, 160, 255)";
	const BLUE_DARK = "rgb(0, 80, 150)";
	const LIGHT_GRAY = "#f0f3f8";
	const BORDER = "#cdd8ea";
	const MUTED = "#5b606b";

	const styles = StyleSheet.create({
		page: {
			paddingTop: 32,
			paddingBottom: 130,
			paddingHorizontal: 32,
			fontSize: 10,
			fontFamily: "Helvetica",
			color: "#1a1f2e",
		},

		/* TOP */
		top: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 32,
			alignItems: "flex-start",
		},

		logo: {
			width: 160,
		},

		/* ── CLIENT BOX ── */
		clientBox: {
			width: 200,
		},

		clientHeader: {
			backgroundColor: BLUE,
			color: "#fff",
			fontSize: 9,
			fontWeight: 400,
			textAlign: "center",
			padding: 5,
			letterSpacing: 1,
			textTransform: "uppercase",
		},

		clientBody: {
			backgroundColor: LIGHT_GRAY,
			padding: 10,
			minHeight: 52,
		},

		clientName: {
			fontSize: 10,
			fontWeight: 400,
		},

		clientCompany: {
			fontSize: 9,
			marginTop: 2,
		},

		clientAddr: {
			fontSize: 9,
			color: "#444",
			marginTop: 2,
			fontWeight: 100,
		},

		/* META TABLE: INVOICE NUMBER / DATE */
		metaWrapper: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 28,
		},

		titleTable: {
			width: 150,
			border: "1px solid " + BORDER,
			alignSelf: "flex-start",
		},

		titleHeadCell: {
			backgroundColor: BLUE_LIGHT,
			color: "#fff",
			fontSize: 7,
			fontWeight: 400,
			padding: 3,
			letterSpacing: 1,
			textTransform: "uppercase",
			textAlign: "center",
		},

		titleBodyCell: {
			backgroundColor: LIGHT_GRAY,
			padding: 5,
			fontSize: 8,
			textAlign: "center",
		},

		metaTable: {
			width: 300,
			border: "1px solid " + BORDER,
		},

		metaHeadRow: {
			flexDirection: "row",
			backgroundColor: BLUE,
			textTransform: "uppercase",
		},

		metaHeadCell: {
			flex: 1,
			textAlign: "center",
			color: "#fff",
			fontSize: 9,
			fontWeight: 400,
			padding: 5,
			letterSpacing: 1,
		},

		metaRow: {
			flexDirection: "row",
			backgroundColor: LIGHT_GRAY,
		},

		title: {
			marginBottom: 10,
		},

		metaCell: {
			flex: 1,
			textAlign: "center",
			padding: 7,
			fontSize: 10,
		},

		/* PRESTATIONS TABLE */
		table: {
			border: "1px solid " + BORDER,
		},

		colDesc: { flex: 3, padding: 5 },
		col: { flex: 1, padding: 5 },

		tableHead: {
			flexDirection: "row",
			backgroundColor: BLUE,
		},

		th: {
			color: "#fff",
			fontSize: 9,
			fontWeight: 400,
			padding: 5,
			textAlign: "center",
			borderRight: "1px solid #cdd8ea",
			textTransform: "uppercase",
		},

		tdLeft: {
			flex: 3,
			padding: 5,
			fontSize: 10,
			textAlign: "left",
			borderRight: "1px solid #cdd8ea",
		},

		tdRight: {
			flex: 1,
			padding: 5,
			fontSize: 10,
			textAlign: "right",
			borderRight: "1px solid #cdd8ea",
		},

		row: {
			flexDirection: "row",
			borderTop: "1px solid #cdd8ea",
			alignItems: "center",
		},

		td: {
			padding: 5,
			fontSize: 10,
		},

		noRightBorder: {
			borderRight: 0,
		},

		altRow: {
			backgroundColor: LIGHT_GRAY,
		},

		/* TOTAL */
		totalWrap: {
			marginTop: 6,
			flexDirection: "row",
			justifyContent: "flex-end",
		},

		totalBoxLabel: {
			borderBottom: "1px solid " + BORDER,
			padding: 6,
			fontSize: 9,
			color: "#444",
			fontWeight: 600,
			minWidth: 435,
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "center",
		},

		totalBox: {
			backgroundColor: LIGHT_GRAY,
			border: "1px solid " + BORDER,
			padding: 6,
			fontSize: 12,
			fontWeight: 600,
			minWidth: 95,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},

		tva: {
			textAlign: "right",
			fontSize: 7,
			fontStyle: "italic",
			color: MUTED,
			marginTop: 4,
			marginBottom: 28,
		},

		/* PAYMENT */
		payHeader: {
			backgroundColor: BLUE,
			textAlign: "center",
			color: "#fff",
			fontSize: 9,
			fontWeight: 400,
			padding: 5,
			letterSpacing: 1,
			marginBottom: 14,
			width: 260,
			textTransform: "uppercase",
		},

		payBody: {
			fontSize: 9,
			lineHeight: 1.6,
		},

		labelName: {
			fontWeight: 600,
		},

		labelBank: {
			fontWeight: 600,
		},

		/* THANK YOU */
		thankyou: {
			fontSize: 11,
		},

		/* FOOTER */
		footer: {
			position: "absolute",
			bottom: 25,
			left: 40,
			right: 40,
			textAlign: "center",
		},

		/* FOOTER THANK YOU */
		footerThankYou: {
			paddingBottom: 10,
			fontSize: 11,
			fontStyle: "italic",
			color: "#444",
		},

		/* FOOTER BODY */
		footerBody: {
			borderTop: "2px solid " + BLUE,
			paddingTop: 10,
			textAlign: "center",
			fontSize: 8,
			color: MUTED,
			lineHeight: 1.6,
		},

		/* FOOTER PAGES */
		footerPages: {
			fontSize: 8,
			color: MUTED,
			textAlign: "right",
		},

		company: {
			fontWeight: 600,
			fontSize: 9,
			color: BLUE_DARK,
			marginBottom: 3,
		},
	});

	const lines = [...invoice.lines];

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* TOP */}
				<View style={styles.top} fixed>
					{logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : <Text>Conciergerie Dulys</Text>}

					<View style={styles.clientBox}>
						<View style={styles.clientHeader}>
							<Text>Client</Text>
						</View>
						<View style={styles.clientBody}>
							{!invoice.removeName && <Text style={styles.clientName}>{invoice.clientId?.name}</Text>}
							{invoice.clientId?.company && <Text style={styles.clientCompany}>{invoice.clientId.company}</Text>}
							<Text style={styles.clientAddr}>{invoice.clientId?.address}</Text>
						</View>
					</View>
				</View>

				{/* META */}
				<View style={[styles.metaWrapper, invoice.title ? {} : { justifyContent: "flex-end" }]}>
					{/* Tableau Intitulé — affiché uniquement si title est renseigné */}
					{invoice.title && (
						<View style={styles.titleTable}>
							<Text style={styles.titleHeadCell}>Intitulé</Text>
							<Text style={styles.titleBodyCell}>{invoice.title}</Text>
						</View>
					)}

					{/* Tableau N° facture / Date */}
					<View style={styles.metaTable}>
						<View style={styles.metaHeadRow}>
							<Text style={styles.metaHeadCell}>Facture n°</Text>
							<Text style={styles.metaHeadCell}>Date</Text>
						</View>
						<View style={styles.metaRow}>
							<Text style={styles.metaCell}>{invoice.number}</Text>
							<Text style={styles.metaCell}>{fmtDate(invoice.date)}</Text>
						</View>
					</View>
				</View>

				{/* TABLE */}
				<View style={styles.table} wrap>
					{/* HEADER */}
					<View style={styles.tableHead} fixed>
						<Text style={[styles.th, styles.colDesc]}>Prestation</Text>
						<Text style={[styles.th, styles.col]}>Quantité</Text>
						<Text style={[styles.th, styles.col]}>Prix unitaire</Text>
						<Text style={[styles.th, styles.col, styles.noRightBorder]}>Total</Text>
					</View>
					{/* BODY */}

					{lines.map((l, i) => {
						const isAlt = i % 2 === 0;

						return (
							<View key={i} style={[styles.row, ...(isAlt ? [styles.altRow] : [])]} wrap={false}>
								<Text style={styles.tdLeft}>{l.description}</Text>
								<Text style={styles.tdRight}>{l.quantity || ""}</Text>
								<Text style={styles.tdRight}>{l.unitPrice ? fmt(l.unitPrice) + " €" : ""}</Text>
								<Text style={[styles.tdRight, styles.noRightBorder]}>{l.total ? fmt(l.total) + " €" : ""}</Text>
							</View>
						);
					})}
				</View>

				{/* TOTAL */}
				<View style={styles.totalWrap} wrap={false}>
					<View style={styles.totalBoxLabel}>
						<Text>Total en EUROS</Text>
					</View>
					<View style={styles.totalBox}>
						<Text>{fmt(invoice.total)} €</Text>
					</View>
				</View>

				<Text style={styles.tva}>TVA non applicable, article 293 B du Code général des impôts</Text>

				{/* PAYMENT */}
				<View wrap={false}>
					<Text style={styles.payHeader}>Modalités et conditions de règlement</Text>

					<View style={styles.payBody}>
						<Text>{payment?.paymentTerms}</Text>
						<Text style={{ marginTop: 6, marginBottom: 4 }}>Règlement par virement bancaire :</Text>
						<Text style={styles.labelName}>{payment?.name}</Text>
						{payment?.iban && (
							<View style={{ flexDirection: "row" }}>
								<Text style={{ width: 40, fontWeight: 600 }}>IBAN</Text>
								<Text>{payment.iban}</Text>
							</View>
						)}
						{payment?.bic && (
							<View style={{ flexDirection: "row" }}>
								<Text style={{ width: 40, fontWeight: 600 }}>BIC</Text>
								<Text>{payment.bic}</Text>
							</View>
						)}
					</View>
				</View>

				{/* FOOTER */}
				<View style={styles.footer} fixed>
					<Text style={styles.footerThankYou}>Merci de votre confiance !</Text>
					<View style={styles.footerBody}>
						<Text style={styles.company}>Conciergerie Dulys</Text>
						<Text>77 Boulevard Raymond Poincaré - 06160 Antibes</Text>
						<Text>Tél. +33 6 01 29 80 90 · contact@conciergerie-dulys.com · N° Siret 101 138 766 00015</Text>
						<Text>www.conciergerie-dulys.com</Text>
					</View>

					{/* PAGE NUMBER */}
					<Text style={styles.footerPages} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} fixed />
				</View>
			</Page>
		</Document>
	);
}
