import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectOrchestratorControl } from "@/components/ProjectOrchestratorControl";
import type { ProjectInfo } from "@/lib/project-name";

describe("ProjectOrchestratorControl", () => {
  const project: ProjectInfo = { id: "my-app", name: "My App" };

  it("renders spawn button when no orchestrator", () => {
    render(
      <ProjectOrchestratorControl
        project={project}
        orchestrator={null}
        onSpawnOrchestrator={vi.fn()}
        isSpawning={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Spawn Orchestrator" })).toBeInTheDocument();
  });

  it("renders orchestrator link when orchestrator exists", () => {
    render(
      <ProjectOrchestratorControl
        project={project}
        orchestrator={{ id: "orch-1", projectId: "my-app", projectName: "My App" }}
        onSpawnOrchestrator={vi.fn()}
        isSpawning={false}
      />,
    );

    const link = screen.getByRole("link", { name: "orchestrator" });
    expect(link).toHaveAttribute("href", "/sessions/orch-1");
  });

  it("shows spawning state", () => {
    render(
      <ProjectOrchestratorControl
        project={project}
        orchestrator={null}
        onSpawnOrchestrator={vi.fn()}
        isSpawning={true}
      />,
    );

    expect(screen.getByRole("button", { name: "Spawning..." })).toBeDisabled();
  });

  it("calls onSpawnOrchestrator when clicked", () => {
    const onSpawn = vi.fn().mockResolvedValue(undefined);

    render(
      <ProjectOrchestratorControl
        project={project}
        orchestrator={null}
        onSpawnOrchestrator={onSpawn}
        isSpawning={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Spawn Orchestrator" }));
    expect(onSpawn).toHaveBeenCalledWith(project);
  });

  it("displays error message when provided", () => {
    render(
      <ProjectOrchestratorControl
        project={project}
        orchestrator={null}
        onSpawnOrchestrator={vi.fn()}
        isSpawning={false}
        error="Project is paused"
      />,
    );

    expect(screen.getByText("Project is paused")).toBeInTheDocument();
  });
});
