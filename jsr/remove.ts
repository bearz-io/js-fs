import type { RemoveOptions } from "./types.ts";
import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

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
    if (Deno) {
        return globals.Deno.remove(path, options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.rm;
        if (!fnAsync) {
            throw new Error("fs.promises.rm is not available");
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
    if (DENO) {
        return globals.Deno.removeSync(path, options);
    }

    if (!fn) {
        fn = loadFs()?.rmSync;
        if (!fn) {
            throw new Error("fs.rmSync is not available");
        }
    }

    fn(path, options);
};
