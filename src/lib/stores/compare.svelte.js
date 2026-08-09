import { browser } from '$app/environment';
import { countries, iso3ToName, nameToIso3 } from '$lib/data';
import { SLOT_COLORS } from '$lib/tokens';

const MAX = 3;

/**
 * The comparison set: up to three countries, each holding a fixed color slot
 * for the whole page, so the colors themselves become the legend.
 * Encoded in the URL hash (#compare=USA,BGD,IND) so prepared states can be
 * bookmarked before the briefing.
 */
class Compare {
	/** @type {string[]} country names, in slot order */
	list = $state([]);

	get max() {
		return MAX;
	}

	get isFull() {
		return this.list.length >= MAX;
	}

	/** Slot color for a country name, or null when it is not in the set. */
	colorOf(name) {
		const i = this.list.indexOf(name);
		return i === -1 ? null : SLOT_COLORS[i];
	}

	has(name) {
		return this.list.includes(name);
	}

	add(name) {
		if (!countries[name] || this.has(name) || this.isFull) return false;
		this.list = [...this.list, name];
		this.#writeHash();
		return true;
	}

	remove(name) {
		this.list = this.list.filter((n) => n !== name);
		this.#writeHash();
	}

	toggle(name) {
		if (this.has(name)) this.remove(name);
		else this.add(name);
	}

	clear() {
		this.list = [];
		this.#writeHash();
	}

	/** Entries ready for charts: name, record, slot color. */
	get entries() {
		return this.list.map((name, i) => ({
			name,
			iso3: nameToIso3[name],
			rec: countries[name],
			color: SLOT_COLORS[i]
		}));
	}

	#writeHash() {
		if (!browser) return;
		const iso = this.list.map((n) => nameToIso3[n]).filter(Boolean);
		const url = new URL(window.location.href);
		url.hash = iso.length ? `compare=${iso.join(',')}` : '';
		history.replaceState(history.state, '', url.toString().replace(/#$/, ''));
	}

	/** Read #compare= on load so a bookmarked state restores. */
	initFromHash() {
		if (!browser) return;
		const m = window.location.hash.match(/compare=([A-Za-z,]+)/);
		if (!m) return;
		const names = m[1]
			.split(',')
			.map((iso) => iso3ToName[iso.toUpperCase()])
			.filter(Boolean)
			.slice(0, MAX);
		if (names.length) this.list = names;
	}
}

export const compare = new Compare();

/** The countries most likely to come up with this group, as one click chips. */
export const QUICK_ADD = ['United States', 'Bangladesh', 'India', 'China', 'Nigeria', 'Brazil'];
