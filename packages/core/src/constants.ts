/**
 * Client-safe constants shared between server and browser bundles.
 *
 * This module intentionally has ZERO Node.js imports so it can be
 * imported from Next.js client components via the sub-path export
 * `@composio/ao-core/constants` without pulling in server-only code.
 */

/**
 * Framing prefix for out-of-band control messages sent over the direct
 * terminal WebSocket. The server embeds this before a JSON payload; the
 * client strips it and dispatches the control frame instead of writing
 * the bytes to xterm. Must match exactly on both sides.
 */
export const DIRECT_TERMINAL_CONTROL_PREFIX = "\0__AO_TERM__";
