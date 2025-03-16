import type { RemoveOptions } from "./types.ts";
import { globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').rmSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').rm | undefined = undefined;

/**
 * Removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function remove(
    path: string | URL,
    options?: RemoveOptions,
): Promise<void> {
    if (globals.Deno) {
        return globals.Deno.remove(path, options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.rm;
        if (!fnAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    return fnAsync(path, options);
};

/**
 * Synchronously removes a file or directory.
 * @param path The path to the file or directory.
 * @param options The options for removing the file or directory (optional).
 */
export function removeSync(path: string | URL, options?: RemoveOptions): void {
    if (globals.Deno) {
        return globals.Deno.removeSync(path, options);
    }

    if (!fn) {
        fn = loadFs()?.rmSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    fn(path, options);
};
