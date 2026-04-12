import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'microgreens-pattambi': './microgreens-pattambi.html',
        'microgreens-valanchery': './microgreens-valanchery.html',
        'microgreens-pallipuram': './microgreens-pallipuram.html',
        'microgreens-pulamanthole': './microgreens-pulamanthole.html',
        'blog/microgreens-benefits-malayalam': './blog/microgreens-benefits-malayalam.html',
        'blog/microgreens-pattambi-delivery': './blog/microgreens-pattambi-delivery.html',
        'blog/microgreens-vs-supermarket-greens': './blog/microgreens-vs-supermarket-greens.html',
        'blog/how-to-use-microgreens-in-kerala-food': './blog/how-to-use-microgreens-in-kerala-food.html',
        'blog/microgreens-subscription-kerala': './blog/microgreens-subscription-kerala.html',
      },
    },
  },
})
