import { browser } from '$app/environment';

/**
 * Reduced motion: honors prefers-reduced-motion and adds a manual toggle,
 * because a briefing room machine may not carry the presenter's OS setting.
 * The fallback is always a crossfade between states, never removal of content.
 */
class Motion {
	/** true when the OS asks for reduced motion */
	system = $state(false);
	/** null = follow the system, true/false = explicit user override */
	override = $state(/** @type {boolean | null} */ (null));

	reduced = $derived(this.override ?? this.system);

	init() {
		if (!browser) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.system = mq.matches;
		const onChange = (e) => (this.system = e.matches);
		mq.addEventListener('change', onChange);

		$effect(() => {
			// Drives the CSS escape hatches in app.css.
			const el = document.documentElement;
			if (this.override === null) el.removeAttribute('data-reduced-motion');
			else el.setAttribute('data-reduced-motion', this.override ? 'on' : 'off');
		});

		return () => mq.removeEventListener('change', onChange);
	}

	toggle() {
		this.override = !this.reduced;
	}
}

export const motion = new Motion();

/** Transition duration in ms, collapsed to a crossfade when motion is reduced. */
export function dur(ms) {
	return motion.reduced ? 0 : ms;
}
