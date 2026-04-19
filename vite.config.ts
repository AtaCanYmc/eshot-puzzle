import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/eshot-puzzle/',
  plugins: [react()],
});

