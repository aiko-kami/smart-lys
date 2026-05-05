import type { Invoice, Payment } from "@/types";
import fs from "fs";
import path from "path";

function fmt(n: number) {
	return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string | Date) {
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getClientName(clientId: any) {
	if (!clientId) return "";
	if (typeof clientId === "string") return "";
	return clientId.name ?? "";
}

function getClientAddress(clientId: any) {
	if (!clientId) return "";
	if (typeof clientId === "string") return "";
	return clientId.address ?? "";
}

export function invoiceTemplate(invoice: Invoice, payment?: Payment | null) {
	const BLUE = "rgb(0, 114, 200)";
	const BLUE_DARK = "rgb(0, 80, 150)";
	const LIGHT_GRAY = "#f0f3f8";
	const BORDER = "#cdd8ea";
	const MUTED = "#5b606b";

	const logoPath = path.join(process.cwd(), "public", "images", "logo-conciergerie-dulys.png");
	const logoBase64 = fs.existsSync(logoPath) ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}` : "";

	// Minimum 5 lines in the table
	const lines = [...invoice.lines];
	while (lines.length < 5) lines.push({ description: "", quantity: 0, unitPrice: 0, total: 0 });

	return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap");

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "DM Sans", Helvetica, Arial, sans-serif;
    background: #fff;
    color: #1a1f2e;
    font-size: 13px;
    line-height: 1.5;
    padding: 32px 40px 40px;
  }

  /* ── LOGO ZONE ── */
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  /* ── CLIENT BOX ── */
  .client-box {
    width: 240px;
  }
  .client-header {
    background: rgb(0, 114, 200);
    color: #fff;
    font-size: 12px;
    font-weight: 1000;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
    padding: 5px 10px;
  }

  .client-body {
    background: ${LIGHT_GRAY};
    padding: 10px 14px 12px;
    min-height: 52px;
  }
  .client-name {
    font-weight: 600;
    font-size: 13px;
  }
  .client-addr {
    font-size: 12px;
    color: #444;
    margin-top: 2px;
  }

  /* ── INVOICE NUMBER / DATE ── */
  .meta-table {
    margin-left: auto;
    width: 360px;
    margin-bottom: 28px;
    border-collapse: collapse;
    border: 1px solid ${BORDER};
    overflow: hidden;
  }
  .meta-table th {
    background: ${BLUE};
    color: #fff;
    font-size: 12px;
    font-weight: 1000;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    padding: 6px 10px;
    width: 50%;
  }
  .meta-table td {
    background: ${LIGHT_GRAY};
    text-align: center;
    padding: 7px 10px;
    font-size: 13px;
    border-top: 1px solid ${BORDER};
  }

  /* ── PRESTATIONS TABLE ── */
  .prestations {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin-bottom: 8px;
  }
  .prestations thead tr {
    background: ${BLUE};
  }
  .prestations thead th {
    color: #fff;
    font-size: 12px;
    font-weight: 1000;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 9px 10px;
    text-align: center;
  }
  .prestations thead th:first-child {
    text-align: center;
    width: 48%;
  }
  .prestations tbody tr:nth-child(even) {
    background: ${LIGHT_GRAY};
  }
  .prestations tbody tr:nth-child(odd) {
    background: #fff;
  }
  .prestations tbody td {
    padding: 4px 10px;
    border: 1px solid ${BORDER};
    text-align: right;
    height: 20px;
  }

  .prestations tbody td:first-child {
    text-align: left;
  }

  /* ── TOTAL ROW ── */
  .total-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0;
    margin-top: 6px;
    margin-bottom: 4px;
    border-bottom: 2px solid ${BORDER};
  }
  .total-label {
    font-size: 13px;
    font-weight: 1000;
    color: ${MUTED};
    padding-right: 16px;
  }
  .total-value {
    background: ${LIGHT_GRAY};
    border: 1px solid ${BORDER};
    border-bottom: none;
    font-size: 14px;
    font-weight: 700;
    padding: 7px 14px;
    min-width: 100px;
    text-align: center;
  }
  .tva-note {
    text-align: right;
    font-size: 10px;
    font-style: italic;
    color: ${MUTED};
    margin-bottom: 28px;
  }

  /* ── PAYMENT SECTION ── */
  .payment-header {
    background: ${BLUE};
    color: #fff;
    font-size: 11px;
    font-weight: 1000;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 14px;
    display: inline-block;
    margin-bottom: 14px;
  }
  .payment-body {
    font-size: 12.5px;
    line-height: 1.8;
    color: #1a1f2e;
    margin-bottom: 36px;
  }
  .payment-body .label {
    display: inline-block;
    font-weight: 600;
    min-width: 48px;
    margin-right: 12px;
  }

  /* ── THANK YOU ── */
  .thankyou {
    text-align: center;
    font-style: italic;
    font-size: 14px;
    margin-bottom: 12px;
    color: #1a1f2e;
  }

  /* ── FOOTER ── */
  .footer {
    position: absolute;
    bottom: 0;
    left: 40px;
    right: 40px;
    border-top: 2px solid ${BLUE};
    padding-top: 10px;
    margin-bottom: 25px;
    text-align: center;
    font-size: 11px;
    color: ${MUTED};
  }
  .footer .company {
    font-weight: 600;
    font-size: 12px;
    color: ${BLUE_DARK};
    margin-bottom: 4px;
  }
</style>
</head>
<body>

  <!-- TOP: Logo + Client -->
  <div class="top">
    <img src="${logoBase64}" width="220" />
    <div class="client-box">
      <div class="client-header">Client</div>
      <div class="client-body">
        <div class="client-name">${getClientName(invoice.clientId)}</div>
        <div class="client-addr">${getClientAddress(invoice.clientId)}</div>
      </div>
    </div>
  </div>

  <!-- FACTURE N° / DATE (aligned right) -->
  <table class="meta-table">
    <thead>
      <tr>
        <th>Facture n°</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${invoice.number}</td>
        <td>${fmtDate(invoice.date)}</td>
      </tr>
    </tbody>
  </table>

  <!-- PRESTATIONS -->
  <table class="prestations">
    <thead>
      <tr>
        <th>Prestation</th>
        <th>Quantité</th>
        <th>Prix unitaire</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${lines
				.map(
					(l) => `
      <tr>
        <td>${l.description ?? ""}</td>
        <td>${l.quantity > 0 ? l.quantity : ""}</td>
        <td>${l.unitPrice > 0 ? fmt(l.unitPrice) + " €" : ""}</td>
        <td>${l.total > 0 ? `<strong>${fmt(l.total)} €</strong>` : ""}</td>
      </tr>`,
				)
				.join("")}
    </tbody>
  </table>

  <!-- TOTAL -->
  <div class="total-row">
    <span class="total-label">Total en EUROS</span>
    <span class="total-value">${fmt(invoice.total)} €</span>
  </div>
  <div class="tva-note">TVA non applicable, article 293 B du Code général des impôts</div>

  <!-- PAYMENT -->
  <div class="payment-header">Modalités et conditions de règlement</div>
  <div class="payment-body">
    <div>${payment?.paymentTerms ?? "Paiement dû sous 30 jours"}</div>
    <div style="margin-top:8px">Règlement par virement bancaire :</div>
    <div><strong>${payment?.name ?? ""}</strong></div>
    ${payment?.iban ? `<div><span class="label">IBAN</span>${payment?.iban}</div>` : ""}
    ${payment?.bic ? `<div><span class="label">BIC</span>${payment?.bic}</div>` : ""}
  </div>

  <!-- THANK YOU -->
  <div class="thankyou">Merci de votre confiance !</div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="company">Conciergerie Dulys</div>
    <div>77 Boulevard Raymond Poincaré - 06160 Antibes</div>
    <div>Tél. +33 6 01 29 80 90 · contact@conciergerie-dulys.com · N° Siret 101 138 766 00015</div>
    <div>www.conciergerie-dulys.com</div>
  </div>

</body>
</html>`;
}
