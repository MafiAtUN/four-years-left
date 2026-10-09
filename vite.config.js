import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const PREFIX = '\0verified-json:';
// The virtual id must not end in .json, or Vite's own JSON plugin tries to
// parse the module we generate.
const SUFFIX = '.js';

/**
 * The verified JSON sits in static/, which is also Vite's public directory, and
 * Vite refuses to let JavaScript import anything from there. We want it bundled,
 * not fetched, so read the file ourselves and hand Vite a plain module back.
 *
 * $data and $static are already rewritten to paths by the time this runs, so
 * match on the file location rather than on the alias.
 */
function verifiedJson() {
	let staticDir = '';
	return {
		name: 'verified-json',
		enforce: 'pre',
		configResolved(config) {
			staticDir = resolve(config.root, 'static') + sep;
		},
		resolveId(id, importer) {
			if (!importer || !id.endsWith('.json')) return null;
			// An alias leaves an absolute file path; import analysis leaves a root
			// relative url. Either can point into static/.
			for (const file of [id, resolve(staticDir, '..', id.replace(/^\/+/, ''))]) {
				if (file.startsWith(staticDir) && existsSync(file)) return PREFIX + file + SUFFIX;
			}
			return null;
		},
		load(id) {
			if (!id.startsWith(PREFIX)) return null;
			const file = id.slice(PREFIX.length, -SUFFIX.length);
			this.addWatchFile(file);
			return `export default ${readFileSync(file, 'utf8')};`;
		}
	};
}

export default defineConfig({
	plugins: [verifiedJson(), tailwindcss(), sveltekit()],
	server: { fs: { strict: true } },
	build: {
		// The briefing machine may be offline; keep everything local and inlined small.
		assetsInlineLimit: 0
	}
});
