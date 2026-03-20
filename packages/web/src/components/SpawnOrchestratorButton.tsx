import type { DashboardOrchestratorLink } from "@/lib/types";
import type { ProjectInfo } from "@/lib/project-name";

export type SpawnButtonVariant = "default" | "compact" | "inline";

interface SpawnOrchestratorButtonProps {
  project: ProjectInfo;
  orchestrator: DashboardOrchestratorLink | null;
  onSpawnOrchestrator: (project: ProjectInfo) => Promise<void>;
  isSpawning: boolean;
  error?: string;
  variant?: SpawnButtonVariant;
}

const variantClasses: Record<SpawnButtonVariant, { button: string; link: string }> = {
  default: {
    button:
      "orchestrator-btn rounded-[var(--radius-lg)] px-4 py-2 text-[12px] font-semibold disabled:cursor-wait disabled:opacity-70",
    link: "orchestrator-btn flex items-center gap-2 rounded-[var(--radius-lg)] px-4 py-2 text-[12px] font-semibold hover:no-underline",
  },
  compact: {
    button:
      "orchestrator-btn rounded-[var(--radius-lg)] px-3 py-1.5 text-[11px] font-semibold disabled:cursor-wait disabled:opacity-70",
    link: "orchestrator-btn flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-1.5 text-[11px] font-semibold hover:no-underline",
  },
  inline: {
    button:
      "orchestrator-btn rounded-[var(--radius-md)] px-2.5 py-1 text-[11px] font-medium disabled:cursor-wait disabled:opacity-70",
    link: "orchestrator-btn flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1 text-[11px] font-medium hover:no-underline",
  },
};

export function SpawnOrchestratorButton({
  project,
  orchestrator,
  onSpawnOrchestrator,
  isSpawning,
  error,
  variant = "default",
}: SpawnOrchestratorButtonProps) {
  const classes = variantClasses[variant];

  return (
    <div className="flex flex-col items-end gap-1.5">
      {orchestrator ? (
        <a
          href={`/sessions/${encodeURIComponent(orchestrator.id)}`}
          className={classes.link}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] opacity-80" />
          orchestrator
          <svg
            className="h-3 w-3 opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => void onSpawnOrchestrator(project)}
          disabled={isSpawning}
          className={classes.button}
        >
          {isSpawning ? "Spawning..." : "Spawn Orchestrator"}
        </button>
      )}

      {error ? (
        <span className="text-[11px] text-[var(--color-status-error)]">{error}</span>
      ) : null}
    </div>
  );
}
