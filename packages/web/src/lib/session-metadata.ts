import { getSessionsDir } from "@composio/ao-core";

/**
 * Resolve sessions metadata directory with metadata override fallback.
 * Returns null when configPath is unavailable/invalid.
 */
export function resolveSessionsDir(
  configPath: string,
  projectPath: string,
  metadata: Record<string, string>,
): string | null {
  const metadataDir = metadata["AO_DATA_DIR"] ?? metadata["aoDataDir"] ?? metadata["sessionsDir"];
  if (metadataDir) return metadataDir;
  try {
    return getSessionsDir(configPath, projectPath);
  } catch {
    return null;
  }
}
