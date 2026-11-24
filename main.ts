// Loading Screen Gold: A Tip in 200 Characters — make.fun program/v1 entry.
// Writes the one loading-screen tip to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// The gate requires UTF-8 text of 1 to 200 characters, a single line,
// not whitespace-only; this program enforces that before writing.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Tip: your AI agent just fixed the same bug three times. The bug is fine. The agent is the bug. Go for a walk; it will still be broken when you get back.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_FILE = "entry.txt";
const EM_DASH = "\u2014";
// Control characters would break the single-line gate and the judge's read.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

function validateEntry(text: string): void {
  const codePoints = [...text];
  if (
    codePoints.length < MIN_CHARS ||
    codePoints.length > MAX_CHARS ||
    text.trim().length === 0 ||
    text.includes("\n") ||
    text.includes(EM_DASH) ||
    CONTROL_CHARS.test(text)
  ) {
    throw new Error(
      `entry must be a single non-blank line of ${MIN_CHARS}-${MAX_CHARS} characters with no em dash or control characters, got ${codePoints.length}`,
    );
  }
}

validateEntry(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, OUTPUT_FILE);
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip: the file on disk must be byte-for-byte what we intended.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("round-trip check failed: entry.txt differs from ENTRY");
}
