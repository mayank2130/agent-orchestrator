import type { DashboardOrchestratorLink } from "@/lib/types";
import type { ProjectInfo } from "@/lib/project-name";
import { SpawnOrchestratorButton } from "./SpawnOrchestratorButton";

export function ProjectOrchestratorControl({
  project,
  orchestrator,
  onSpawnOrchestrator,
  isSpawning,
  error,
}: {
  project: ProjectInfo;
  orchestrator: DashboardOrchestratorLink | null;
  onSpawnOrchestrator: (project: ProjectInfo) => Promise<void>;
  isSpawning: boolean;
  error?: string;
}) {
  return (
    <SpawnOrchestratorButton
      project={project}
      orchestrator={orchestrator}
      onSpawnOrchestrator={onSpawnOrchestrator}
      isSpawning={isSpawning}
      error={error}
      variant="default"
    />
  );
}
