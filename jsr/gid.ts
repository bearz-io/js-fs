import { globals } from "./globals.ts";

/**
 * Gets the current group id for the current user on POSIX platforms.
 * Returns `null` on Windows.
 * @returns The current group id or `null` if not available.
 * @example
 * ```ts
 * import { gid } from "@bearz/fs/gid";
 * const groupId = gid();
 * console.log("Current group ID:", groupId);
 * ```
 */
export function gid(): number | null {
    if (globals.Deno) {
        return globals.Deno.gid();
    }

    if (globals.process && globals.process.getgid) {
        const gid = globals.process.getgid();
        if (gid === undefined || gid === -1) {
            return null;
        }

        return gid;
    }

    return null;
}
