interface FieldProps {
	label: string;
	children: React.ReactNode;
}

export default function Field({ label, children }: FieldProps) {
	return (
		<div>
			<label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
			{children}
		</div>
	);
}
