import type { InvoiceStatus } from "@/types";
import { formatStatus, statusClass } from "@/utils/invoice";

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
	return <span className={`inline-block w-full rounded-full px-4 py-1 text-sm ${statusClass(status)}`}>{formatStatus(status)}</span>;
}
