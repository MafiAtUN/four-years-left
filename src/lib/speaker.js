/**
 * The speaker, shown on /speaker between the quiz and the briefing.
 *
 * Title, record and certifications come from the bio Mafizul supplied for the
 * PGA81 staff directory on 15 September 2026. Change them here, never in the
 * page. The QR code in static/qr-linkedin.svg encodes LINKEDIN exactly; if the
 * address changes, regenerate it with segno (error level M, scale 10, border 2,
 * dark #0b1b3f), the same settings as static/qr-quiz.svg.
 */
export const SPEAKER = {
	name: 'Mafizul Islam',
	role: 'Senior Adviser (Data, AI and Strategic Foresight)',
	office: 'Office of the President of the UN General Assembly, 81st session',
	photo: 'speaker.jpg',
	linkedin: 'https://www.linkedin.com/in/mafizul/',

	/** Three short lines a room of non native speakers can read from the back. */
	record: [
		'15 years in data and AI across Asia, Africa and UN Headquarters in New York, 12 of them with the United Nations.',
		'Builds AI tools for UN peacekeeping, human rights monitoring, General Assembly analysis and SDG monitoring.',
		'Has written AI strategies and governance frameworks for several UN entities, and contributed to UN-wide work on AI impact assessment.'
	],

	degree: 'Advanced degree in Data Science and Artificial Intelligence',

	certifications: [
		'4 Microsoft professional certifications',
		'PRINCE2 Practitioner',
		'ITIL Foundation',
		'CompTIA Security+'
	]
};
