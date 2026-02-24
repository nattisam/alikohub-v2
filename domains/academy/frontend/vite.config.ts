import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
