import { browser } from '$app/environment';

/**
 * The presentation layer's spine.
 *
 * Every scene boundary and every scrolly step registers itself as a stop.
 * Because scrolly states are a pure function of scroll position, driving the
 * scroll drives the story, so the same page is a deck from the podium and an
 * article for a student reading it next week.
 */
class Stops {
	/** @type {{ el: HTMLElement, scene: number, label: string }[]} */
	items = $state([]);
	/** index of the stop the viewport is currently sitting on */
	current = $state(0);
	/** true while a programmatic smooth scroll is in flight */
	seeking = $state(false);

	register(el, { scene, label = '' }) {
		const item = { el, scene, label };
		this.items = [...this.items, item];
		return () => {
			this.items = this.items.filter((i) => i !== item);
		};
	}

	/** Stops in document order with their absolute page offsets. */
	get ordered() {
		if (!browser) return [];
		return this.items
			.map((i) => ({ ...i, top: i.el.getBoundingClientRect().top + window.scrollY }))
			.sort((a, b) => a.top - b.top);
	}

	/** Scene numbers present on the page, ascending. Drives the progress rail. */
	get scenes() {
		return [...new Set(this.ordered.map((s) => s.scene))].sort((a, b) => a - b);
	}

	scrollToIndex(i) {
		const list = this.ordered;
		if (!list.length) return;
		const clamped = Math.max(0, Math.min(list.length - 1, i));
		const target = list[clamped];
		this.seeking = true;
		// A stop sits a little below the viewport top so the caption card and the
		// chart title are both in frame when the scroll settles.
		window.scrollTo({ top: Math.max(0, target.top - 4), behavior: 'smooth' });
		this.current = clamped;
		clearTimeout(this._t);
		this._t = setTimeout(() => (this.seeking = false), 700);
	}

	next() {
		this.scrollToIndex(this.currentIndexFromScroll() + 1);
	}

	prev() {
		this.scrollToIndex(this.currentIndexFromScroll() - 1);
	}

	/** Jump to the first stop of a scene, for the digit keys and the rail. */
	toScene(scene) {
		const list = this.ordered;
		const i = list.findIndex((s) => s.scene === scene);
		if (i !== -1) this.scrollToIndex(i);
	}

	toTop() {
		this.seeking = true;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		this.current = 0;
		clearTimeout(this._t);
		this._t = setTimeout(() => (this.seeking = false), 700);
	}

	/** The last stop at or above the viewport anchor line. */
	currentIndexFromScroll() {
		const list = this.ordered;
		if (!list.length) return 0;
		const y = window.scrollY + 8;
		let idx = 0;
		for (let i = 0; i < list.length; i++) if (list[i].top <= y) idx = i;
		return idx;
	}

	syncFromScroll() {
		if (this.seeking) return;
		this.current = this.currentIndexFromScroll();
	}

	get currentScene() {
		return this.ordered[this.current]?.scene ?? 1;
	}
}

export const stops = new Stops();
