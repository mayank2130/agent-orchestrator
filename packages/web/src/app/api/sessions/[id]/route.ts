import { NextResponse, type NextRequest } from "next/server";
import { getServices, getSCM } from "@/lib/services";
import { resolveSessionsDir } from "@/lib/session-metadata";
import {
  sessionToDashboard,
  resolveProject,
  enrichSessionPR,
  enrichSessionsMetadata,
} from "@/lib/serialize";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { config, registry, sessionManager } = await getServices();

    const coreSession = await sessionManager.get(id);
    if (!coreSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const dashboardSession = sessionToDashboard(coreSession);

    // Enrich metadata (issue labels, agent summaries, issue titles)
    await enrichSessionsMetadata([coreSession], [dashboardSession], config, registry);

    // Enrich PR — always fetch fresh data for the detail endpoint (no cache)
    if (coreSession.pr) {
      const project = resolveProject(coreSession, config.projects);
      const scm = getSCM(registry, project);
      if (scm && project) {
        const sessionsDir = resolveSessionsDir(
          config.configPath,
          project.path,
          coreSession.metadata,
        );
        await enrichSessionPR(dashboardSession, scm, coreSession.pr, {
          bypassCache: true,
          metadata: sessionsDir
            ? {
                sessionsDir,
                sessionId: coreSession.id,
                currentStatus: coreSession.status,
              }
            : undefined,
        });
      }
    }

    return NextResponse.json(dashboardSession);
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
