export default {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				scaleIn: {
					"0%": {
						opacity: "0",
						transform: "scale(0.96) translateY(10px)",
					},
					"100%": {
						opacity: "1",
						transform: "scale(1) translateY(0)",
					},
				},
			},
			animation: {
				scaleIn: "scaleIn 0.2s ease-out",
			},
		},
	},
};
