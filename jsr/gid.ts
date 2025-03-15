import { DENO, globals, } from "./globals.ts";

/**
 * Gets the current group id on POSIX platforms.
 * Returns `null` on Windows.
 */
export function gid(): number | null {
    if (DENO) {
        return globals.Deno.gid();
    }

    if (globals.process && globals.process.getgid) {
        return globals.process.getgid();
    }

    return null;
};
