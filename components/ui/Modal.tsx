"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

export default function Modal({ open, onClose, children, className = "" }: ModalProps) {
	// ESC close
	useEffect(() => {
		if (!open) return;

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={onClose}
				>
					{/* BACKDROP */}
					<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

					{/* MODAL CONTAINER */}
					<motion.div
						onClick={(e) => e.stopPropagation()}
						className={`relative max-w-2xl rounded-2xl border border-white/10 bg-[#0B1220] shadow-2xl ${className}`}
						initial={{ opacity: 0, scale: 0.96, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: 20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
