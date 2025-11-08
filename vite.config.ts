import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/REPO_NAME/", // <-- add your repo name here
  plugins: [react()],
});
