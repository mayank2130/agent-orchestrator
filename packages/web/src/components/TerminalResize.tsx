import { useEffect } from "react";
import type { Terminal as TerminalType } from "xterm";
import type { FitAddon as FitAddonType } from "@xterm/addon-fit";

interface UseTerminalResizeOptions {
  /** The xterm.js terminal instance. */
  terminal: TerminalType | null;
  /** The FitAddon instance used to resize the terminal. */
  fitAddon: FitAddonType | null;
  /** A ref-like getter for the current WebSocket (may reconnect). */
  getWebSocket: () => WebSocket | null;
  /** The terminal container element. */
  container: HTMLDivElement | null;
  /** Whether the terminal is in fullscreen mode. */
  fullscreen: boolean;
}

/**
 * Send a resize message over the given WebSocket if it is open.
 * Pure helper -- no side effects beyond the network send.
 */
export function sendResizeMessage(
  ws: WebSocket | null,
  cols: number,
  rows: number,
): void {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "resize", cols, rows }));
  }
}

/**
 * Hook that re-fits the terminal whenever `fullscreen` changes.
 *
 * It waits for the container's CSS transition to settle (height stops
 * changing between animation frames) before performing the fit, with
 * backup timers at 300 ms and 600 ms.
 */
export function useTerminalResize({
  terminal,
  fitAddon,
  getWebSocket,
  container,
  fullscreen,
}: UseTerminalResizeOptions): void {
  useEffect(() => {
    if (!fitAddon || !terminal || !container) return;

    const ws = getWebSocket();
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    let resizeAttempts = 0;
    const maxAttempts = 60;
    let cancelled = false;
    let rafId = 0;
    let lastHeight = -1;

    const resizeTerminal = () => {
      if (cancelled) return;
      resizeAttempts++;

      // Wait for the container height to stabilise (CSS transition finished)
      const currentHeight = container.getBoundingClientRect().height;
      const settled = lastHeight >= 0 && Math.abs(currentHeight - lastHeight) < 1;
      lastHeight = currentHeight;

      if (!settled && resizeAttempts < maxAttempts) {
        rafId = requestAnimationFrame(resizeTerminal);
        return;
      }

      // Container is at target size, now resize terminal
      terminal.refresh(0, terminal.rows - 1);
      fitAddon.fit();
      terminal.refresh(0, terminal.rows - 1);

      sendResizeMessage(getWebSocket(), terminal.cols, terminal.rows);
    };

    // Start resize polling
    rafId = requestAnimationFrame(resizeTerminal);

    // Also try on transitionend
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (cancelled) return;
      if (e.target === container.parentElement) {
        resizeAttempts = 0;
        lastHeight = -1;
        setTimeout(() => {
          if (!cancelled) rafId = requestAnimationFrame(resizeTerminal);
        }, 50);
      }
    };

    const parent = container.parentElement;
    parent?.addEventListener("transitionend", handleTransitionEnd);

    // Backup timers in case RAF polling doesn't work
    const timer1 = setTimeout(() => {
      if (cancelled) return;
      resizeAttempts = 0;
      lastHeight = -1;
      resizeTerminal();
    }, 300);
    const timer2 = setTimeout(() => {
      if (cancelled) return;
      resizeAttempts = 0;
      lastHeight = -1;
      resizeTerminal();
    }, 600);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      parent?.removeEventListener("transitionend", handleTransitionEnd);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [fullscreen, terminal, fitAddon, getWebSocket, container]);
}
