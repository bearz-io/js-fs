import type { WriteOptions } from "./types.ts";
import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').writeFileSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').writeFile | undefined = undefined;


/**
 * Writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function writeTextFile(
    path: string | URL,
    data: string,
    options?: WriteOptions,
): Promise<void> {
    if (DENO) {
        return Deno.writeTextFile(path, data, options);
    }
    

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.writeFile;
        if (!fnAsync) {
            throw new Error("fs.promises.writeFile is not available");
        }
    }

    const o: Record<string, unknown> = {};
    o.mode = options?.mode;
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();

        if (!globals.AbortController) {
            throw new Error("AbortController is not available");
        }

        const c = new globals.AbortController();
        options.signal.addEventListener("abort", () => {
            c.abort();
        });

        o.signal = c.signal;
    }

  
    return fnAsync(path, data, o)
};

/**
 * Synchronously writes text data to a file.
 * @param path The path to the file.
 * @param data The text data to write.
 * @param options The options for writing the file (optional).
 */
export function writeTextFileSync(
    path: string | URL,
    data: string,
    options?: WriteOptions,
): void {
    if (DENO) {
        return Deno.writeTextFileSync(path, data, options);   
    }
    
    if (!fn) {
        fn = loadFs()?.writeFileSync;
        if (!fn) {
            throw new Error("fs.writeFileSync is not available");
        }
    }

    const o: Record<string, unknown> = {};
    o.mode = options?.mode;
    o.flag = options?.append ? "a" : "w";
    if (options?.create) {
        o.flag += "+";
    }
    o.encoding = "utf8";
    if (options?.signal) {
        options.signal.throwIfAborted();

        if (!globals.AbortController) {
            throw new Error("AbortController is not available");
        }

        const c = new globals.AbortController();
        options.signal.addEventListener("abort", () => {
            c.abort();
        });

        o.signal = c.signal;
    }
    return fn(path, data, o);
};