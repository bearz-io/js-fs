import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').utimesSync | undefined;
let fnAsync: typeof  import('node:fs/promises').utimes | undefined;

/**
 * Changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 * @returns A promise that resolves when the operation is complete.
 */
export function utime(
    path: string | URL,
    atime: number | Date,
    mtime: number | Date,
): Promise<void> {
    if (DENO) {
        return globals.Deno.utime(path, atime, mtime);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.utimes;
        if (!fnAsync) {
            throw new Error("fs.promises.utimes is not available");
        }
    }

    return fnAsync(path, atime, mtime);
};

/**
 * Synchronously changes the access time and modification time of a file or directory.
 * @param path The path to the file or directory.
 * @param atime The new access time.
 * @param mtime The new modification time.
 */
export function utimeSync(
    path: string | URL,
    atime: number | Date,
    mtime: number | Date,
): void {
    if (DENO) {
        return globals.Deno.utimeSync(path, atime, mtime);
    }

    if (!fn) {
        fn = loadFs()?.utimesSync;
        if (!fn) {
            throw new Error("fs.utimesSync is not available");
        }
    }

    fn(path, atime, mtime);
};