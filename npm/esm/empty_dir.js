/**
 * The `empty-dir` module provides functions to ensure that a directory is empty.
 * It deletes the directory contents if it is not empty. If the directory does not exist, it creates it.
 *
 * @module
 */
import "./_dnt.polyfills.js";
import { toPathString } from "./utils.js";
import { join } from "@bearz/path";
import { isNotFoundError } from "./errors.js";
import { makeDir, makeDirSync } from "./make_dir.js";
import { readDir, readDirSync } from "./read_dir.js";
import { remove, removeSync } from "./remove.js";
/**
 * Asynchronously ensures that a directory is empty deletes the directory
 * contents it is not empty. If the directory does not exist, it is created.
 * The directory itself is not deleted.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param dir The path of the directory to empty, as a string or URL.
 * @returns A void promise that resolves once the directory is empty.
 *
 * @example
 * ```ts
 * import { emptyDir } from "@bearz/fs";
 *
 * await emptyDir("./foo");
 * ```
 */
export async function emptyDir(dir) {
    try {
        const items = await Array.fromAsync(readDir(dir));
        await Promise.all(items.map((item) => {
            if (item && item.name) {
                const filepath = join(toPathString(dir), item.name);
                return remove(filepath, { recursive: true });
            }
        }));
    } catch (err) {
        if (err instanceof Error) {
            if (!isNotFoundError(err)) {
                throw err;
            }
        }
        // if not exist. then create it
        await makeDir(dir, { recursive: true });
    }
}
/**
 * Synchronously ensures that a directory is empty deletes the directory
 * contents it is not empty. If the directory does not exist, it is created.
 * The directory itself is not deleted.
 *
 * Requires the `--allow-read` and `--allow-write` flag when using Deno.
 *
 * @param dir The path of the directory to empty, as a string or URL.
 * @returns A void value that returns once the directory is empty.
 *
 * @example
 * ```ts
 * import { emptyDirSync } from "@bearz/fs";
 *
 * emptyDirSync("./foo");
 * ```
 */
export function emptyDirSync(dir) {
    try {
        const items = [...readDirSync(dir)];
        // If the directory exists, remove all entries inside it.
        while (items.length) {
            const item = items.shift();
            if (item && item.name) {
                const filepath = join(toPathString(dir), item.name);
                removeSync(filepath, { recursive: true });
            }
        }
    } catch (err) {
        if (!isNotFoundError(err)) {
            throw err;
        }
        // if not exist. then create it
        makeDirSync(dir, { recursive: true });
    }
}
