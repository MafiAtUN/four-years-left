/**
 * The only two values that change between rehearsal and the podium.
 *
 * QUIZ_DB is the Firebase Realtime Database URL from FIREBASE.md, with no
 * trailing slash, for example:
 *
 *   export const QUIZ_DB = 'https://four-years-left-default-rtdb.firebaseio.com';
 *
 * Leave it empty and the whole quiz still works: phones score locally and the
 * reveal shows the correct answer, the chimp line, the fact and the source
 * without the room's bars. Nothing on screen ever announces the difference.
 */
export const QUIZ_DB = '';

/**
 * The URL printed under the QR code, for anyone whose camera will not focus.
 * It must match what static/qr-quiz.svg encodes, which is verified to be
 * exactly this string.
 */
export const QUIZ_URL = 'https://mafiatun.github.io/four-years-left/quiz';

/** Presenter poll interval while Scene 0 is on screen. */
export const POLL_MS = 2000;

/** A chimpanzee picking at random gets one in three right. */
export const CHIMP = 1 / 3;
