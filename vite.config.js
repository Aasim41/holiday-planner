import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        destinations: resolve(__dirname, 'destinations.html'),
        inquiry: resolve(__dirname, 'inquiry.html'),
        location: resolve(__dirname, 'location.html'),
        service: resolve(__dirname, 'service.html'),
      },
    },
  },
})
