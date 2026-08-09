import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			// Data is imported and bundled, never fetched: guarantees offline safety
			// and lets every number be traced to the verified JSON at build time.
			$data: 'static/data',
			$static: 'static'
		},
		paths: {
			// GitHub Pages project site: served from /four-years-left.
			// The Actions workflow injects BASE_PATH=/<repo-name>.
			base: process.env.BASE_PATH ?? '/four-years-left',
			relative: false
		},
		prerender: {
			entries: ['*'],
			handleHttpError: 'fail'
		}
	}
};

export default config;
