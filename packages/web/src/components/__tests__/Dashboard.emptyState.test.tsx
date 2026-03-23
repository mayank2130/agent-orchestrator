import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Dashboard } from "../Dashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  const eventSourceMock = {
    onmessage: null,
    onerror: null,
    close: vi.fn(),
  };
  const eventSourceConstructor = vi.fn(() => eventSourceMock as unknown as EventSource);
  global.EventSource = Object.assign(eventSourceConstructor, {
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
  }) as unknown as typeof EventSource;
  global.fetch = vi.fn();
  localStorage.clear();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("Dashboard empty state", () => {
  it("shows no-projects empty state when no projects configured", () => {
    render(<Dashboard initialSessions={[]} />);
    expect(screen.getByText("No projects configured")).toBeInTheDocument();
  });

  it("shows spawn empty state for a single project with no sessions", () => {
    render(
      <Dashboard
        initialSessions={[]}
        projects={[{ id: "proj", name: "My Project" }]}
      />,
    );
    expect(screen.getByText("Spawn orchestrator to get started")).toBeInTheDocument();
  });

  it("does not show empty state when sessions exist", () => {
    const { queryByText } = render(
      <Dashboard
        initialSessions={[
          {
            id: "s1",
            projectId: "proj",
            status: "working",
            activity: "active",
            branch: "feat/x",
            issueId: null,
            issueUrl: null,
            issueLabel: null,
            issueTitle: null,
            summary: "Working on it",
            summaryIsFallback: false,
            createdAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
            pr: null,
            metadata: {},
          },
        ]}
        projects={[{ id: "proj", name: "My Project" }]}
      />,
    );
    expect(queryByText("No projects configured")).not.toBeInTheDocument();
    expect(queryByText("Spawn orchestrator to get started")).not.toBeInTheDocument();
  });
});
