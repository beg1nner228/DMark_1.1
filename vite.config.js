import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/DMark_1.1/", 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        bookmarks: resolve(__dirname, "bookmark.html"),
      },
    },
  },
});
