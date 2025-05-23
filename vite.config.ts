import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  dotenv.config({ path: `.env.${mode}` });
  return {
    plugins: [react()],
    server: {
      open: true,
      // ...(mode === "development"
      //   ? {
      //       https: {
      //         key: fs.readFileSync("C:/Users/ASUS/Downloads/localhost-key.pem"),
      //         cert: fs.readFileSync("C:/Users/ASUS/Downloads/localhost.pem"),
      //       },
      //     }
      //   : {}),
    },
  };
});
