/**
 * Screenshot the site at arbitrary scroll positions via the Chrome DevTools
 * Protocol, so every scrolly state can be eyeballed without a human scrolling.
 *
 *   node scripts/shot.mjs out.png "/#stall" 2.5
 *
 * The third argument is the scroll position in viewport heights. It can also be
 * a selector prefixed with @, e.g. @#world, or "step:<sectionId>:<n>" to land on
 * the nth scrolly step of a section.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const [, , out = 'shot.png', path = '/', where = '0'] = process.argv;
const URL_BASE = process.env.SITE ?? 'http://localhost:4173/four-years-left';

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		'--disable-gpu',
		'--no-sandbox',
		'--hide-scrollbars',
		'--force-device-scale-factor=1',
		'--window-size=1920,1080',
		`--remote-debugging-port=${PORT}`,
		'--user-data-dir=/tmp/chrome-shot-profile',
		'about:blank'
	],
	{ stdio: 'ignore' }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
	for (let i = 0; i < 60; i++) {
		try {
			const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
			const list = await r.json();
			const page = list.find((t) => t.type === 'page');
			if (page) return page;
		} catch {}
		await sleep(250);
	}
	throw new Error('Chrome did not expose a debugging target');
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
	ws.onopen = res;
	ws.onerror = rej;
});

let id = 0;
const pending = new Map();
const consoleErrors = [];

ws.onmessage = (ev) => {
	const msg = JSON.parse(ev.data);
	if (msg.id && pending.has(msg.id)) {
		pending.get(msg.id)(msg.result);
		pending.delete(msg.id);
	}
	if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
		consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
	}
	if (msg.method === 'Runtime.exceptionThrown') {
		consoleErrors.push(
			msg.params.exceptionDetails.exception?.description ??
				msg.params.exceptionDetails.text ??
				'exception'
		);
	}
};

function send(method, params = {}) {
	const msgId = ++id;
	ws.send(JSON.stringify({ id: msgId, method, params }));
	return new Promise((res) => pending.set(msgId, res));
}

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
	width: 1920,
	height: 1080,
	deviceScaleFactor: 1,
	mobile: false
});

await send('Page.navigate', { url: URL_BASE + path });
await sleep(2500);

// Position the viewport.
let js;
if (where.startsWith('@')) {
	js = `document.querySelector(${JSON.stringify(where.slice(1))})?.scrollIntoView(); window.scrollY`;
} else if (where.startsWith('js:')) {
	// Arbitrary setup, e.g. clicking the reveal toggle before the shot.
	js = where.slice(3);
} else if (where.startsWith('step:')) {
	const [, sectionId, n] = where.split(':');
	// Land in the middle of the nth step block of a section's scroller.
	js = `(() => {
		const sec = document.querySelector(${JSON.stringify('#' + sectionId)});
		const steps = sec.querySelectorAll('[data-step]');
		const el = steps[${Number(n)}];
		if (!el) return -1;
		const top = el.getBoundingClientRect().top + window.scrollY;
		window.scrollTo(0, top + 4);
		return window.scrollY;
	})()`;
} else {
	js = `window.scrollTo(0, ${Number(where)} * window.innerHeight); window.scrollY`;
}

const res = await send('Runtime.evaluate', { expression: js, returnByValue: true });
await sleep(2800); // smooth scroll plus the longest chart transition

const shot = await send('Page.captureScreenshot', { format: 'png' });
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));

console.log(`${out}  scrollY=${res?.result?.value}`);
if (consoleErrors.length) {
	console.log('CONSOLE ERRORS:');
	for (const e of [...new Set(consoleErrors)]) console.log('  ' + e);
} else {
	console.log('console: clean');
}

ws.close();
chrome.kill();
process.exit(0);
