// Read a project text file from a test. Vitest returns CSS modules empty even with ?raw, and the app's
// tsconfig carries no Node types, so tests import this untyped helper instead (as they do theme-svg.mjs).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function readText(relativeToProject) {
  return readFileSync(join(root, relativeToProject), 'utf8');
}

// Made with my soul - Swately <3
