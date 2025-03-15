import type { ReadOptions } from "./types.ts";
import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').readFileSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').readFile | undefined = undefined;

/**
 * Reads the contents of a file as text.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a string.
 */
export function readTextFile(path: string | URL, options?: ReadOptions): Promise<string> {
    if (DENO) {
        return globals.Deno.readTextFile(path, options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readFile;
        if (!fnAsync) {
            throw new Error("fs.promises.readFile is not available");
        }
    }

    if (options?.signal) {
        options.signal.throwIfAborted();

        if (!globals.AbortController) {
            throw new Error("AbortController is not available");
        }

        const c = new globals.AbortController();
        options.signal.addEventListener("abort", () => {
            c.abort();
        });

        return fnAsync(path, { encoding: 'utf-8', signal: c.signal });
    }

    return fnAsync(path, { encoding: 'utf-8' });
};

/**
 * Synchronously Reads the contents of a file as text.
 * @param path The path to the file.
 * @returns The file contents as a string.
 */
export function readTextFileSync(path: string | URL): string {
    if (DENO) {
        return globals.Deno.readTextFileSync(path);
    }

    if (!fn) {
        fn = loadFs()?.readFileSync;
        if (!fn) {
            throw new Error("fs.readFileSync is not available");
        }
    }

    return fn(path, { encoding: 'utf-8' });
};