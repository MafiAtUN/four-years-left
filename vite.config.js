import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: { fs: { strict: true } },
	build: {
		// The briefing machine may be offline; keep everything local and inlined small.
		assetsInlineLimit: 0
	}
});
