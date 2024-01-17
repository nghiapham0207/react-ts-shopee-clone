import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), visualizer()],
	css: {
		devSourcemap: true, // cho phép hiển thị css ở file nào trên devtool browser
	},
	server: {
		port: 3000,
	},
	test: {
		globals: true,
		environment: "jsdom",
	},
});