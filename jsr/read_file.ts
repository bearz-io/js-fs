import { globals, loadFs, loadFsAsync } from "./globals.ts";
import type { ReadOptions } from "./types.ts";

let fn: typeof import('node:fs').readFileSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').readFile | undefined = undefined;

/**
 * Reads the contents of a file.
 * @param path The path to the file.
 * @param options The options for reading the file (optional).
 * @returns A promise that resolves with the file contents as a Uint8Array.
 */
export function readFile(path: string | URL, options?: ReadOptions): Promise<Uint8Array> {
    if (globals.Deno) {
        return globals.Deno.readFile(path);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readFile;
        if (!fnAsync) {
            return Promise.reject(new Error("No suitable file system module found."));
        }
    }

    if (options?.signal) {
        options.signal.throwIfAborted();

        return fnAsync(path, { signal: options.signal });
    }

    return fnAsync(path);
};

/**
 * Synchronously reads the contents of a file.
 * @param path The path to the file.
 * @returns The file contents as a Uint8Array.
 */
export function readFileSync(path: string | URL): Uint8Array {
    if (globals.Deno) {
        return globals.Deno.readFileSync(path);
    }

    if (!fn) {
        fn = loadFs()?.readFileSync;
        if (!fn) {
            throw new Error("No suitable file system module found.");
        }
    }

    return fn(path);
};
