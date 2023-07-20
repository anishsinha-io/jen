import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@services": path.resolve(__dirname, "./src/services")
        },
    },
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 5173,
        watch: {
            usePolling: true
        }
    }
});
