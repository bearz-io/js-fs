import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let cp : typeof import("node:fs").copyFileSync | undefined;
let cpAsync : typeof import("node:fs/promises").copyFile | undefined;


/**
 * Copies a file asynchronously.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @returns A promise that resolves when the operation is complete.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFile } from "@bearz/fs/copy-file";
 * async function copy() {
 *    try {
 *       await copyFile("source.txt", "destination.txt");
 *       console.log("File copied successfully.");
 *   } catch (error) {
 *       console.error("Error copying file:", error);
 *   }
 * }
 * await copy();
 * ```
 */
export function copyFile(
    from: string | URL,
    to: string | URL,
): Promise<void> {
    if (DENO) {
        return globals.Deno.copyFile(from, to);
    }

    if (cpAsync) {
        return cpAsync(from, to);
    }

    const fs = loadFsAsync();
    if (fs) {
        cpAsync = fs.copyFile;
        return cpAsync(from, to);
    }

    throw new Error("No suitable file system module found.");
};

/**
 * Synchronously copies a file.
 * @param from The path to the source file.
 * @param to The path to the destination file.
 * @throws {Error} If the operation fails.
 * @example
 * ```ts
 * import { copyFileSync } from "@bearz/fs/copy-file";
 * function copy() {
 *   try {
 *      copyFileSync("source.txt", "destination.txt");
 *      console.log("File copied successfully.");
 *   } catch (error) {
 *      console.error("Error copying file:", error);
 *   }
 * }
 * copy();
 * ```
 */
export function copyFileSync(
    from: string | URL,
    to: string | URL,
): void {
    if (DENO) {
        return globals.Deno.copyFileSync(from, to);
    }

    if (cp) {
        return cp(from, to);
    }

    const fs = loadFs();
    if (fs) {
        cp = fs.copyFileSync;
        return cp(from, to);
    }

    throw new Error("No suitable file system module found.");
};
