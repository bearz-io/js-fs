import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').renameSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').rename | undefined = undefined;


/**
 * Renames a file or directory.
 * @param oldPath The path to the existing file or directory.
 * @param newPath The path to the new file or directory.
 * @returns A promise that resolves when the operation is complete.
 */
export function rename(
    oldPath: string | URL,
    newPath: string | URL,
): Promise<void> {
    if (DENO) {
        return globals.Deno.rename(oldPath, newPath);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.rename;
        if (!fnAsync) {
            throw new Error("fs.promises.rename is not available");
        }
    }

    return fnAsync(oldPath, newPath);
};

/**
 * Synchronously renames a file or directory.
 * @param oldPath The path to the existing file or directory.
 * @param newPath The path to the new file or directory.
 */
export function renameSync(oldPath: string | URL, newPath: string | URL): void {
    if (DENO) {
        return globals.Deno.renameSync(oldPath, newPath);
    }

    if (!fn) {
        fn = loadFs()?.renameSync;
        if (!fn) {
            throw new Error("fs.renameSync is not available");
        }
    }

    fn(oldPath, newPath);
};