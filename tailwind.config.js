// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	// corePlugins để disable class tailwind nào không dùng
	corePlugins: {
		container: false, // bỏ class container cũ
	},
	theme: {
		extend: {
			// mở rộng thêm màu mới
			colors: {
				orange: "#ee4d2d",
			},
			keyframes: {
				wiggle: {
					"0%, 100%": {
						transform: "translateY(2px)",
					},
					"50%": {
						transform: "translateY(-2px)",
					},
				},
			},
		},
	},
	plugins: [
		plugin(function ({ addComponents, theme }) {
			addComponents({
				".container": {
					maxWidth: theme("columns.7xl"),
					marginLeft: "auto",
					marginRight: "auto",
					paddingLeft: theme("spacing.4"),
					paddingRight: theme("spacing.4"),
				},
			});
		}),
		import("@tailwindcss/line-clamp"),
	],
};
