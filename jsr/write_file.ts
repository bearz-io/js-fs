import type { WriteOptions } from "./types.ts";
import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";

let fn: typeof import('node:fs').writeFileSync | undefined = undefined;
let createWriteStream : typeof import('node:fs').createWriteStream | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').writeFile | undefined = undefined;


/**
 * Writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 * @returns A promise that resolves when the operation is complete.
 */
export function writeFile(
    path: string | URL,
    data: Uint8Array | ReadableStream<Uint8Array>,
    options?: WriteOptions | undefined,
): Promise<void> {
    if (DENO) {
        return globals.Deno.writeFile(path, data, options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.writeFile;
        if (!fnAsync) {
            throw new Error("fs.promises.writeFile is not available");
        }
    }

    if (data instanceof ReadableStream) {
        if (!createWriteStream) {
            createWriteStream = loadFs()?.createWriteStream;
            if (!createWriteStream) {
                throw new Error("fs.createWriteStream is not available");
            }
        }

        const sr = createWriteStream(path, options);
        const writer = new WritableStream({
            write(chunk) {
                sr.write(chunk);
            },
        });

        return data.pipeTo(writer).finally(() => {
            sr.close();
        });
    }

    const o : Record<string, unknown> = {};
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
        
        options.signal.onabort = () => {
            c.abort();
        }

        o.signal = c.signal;
    }

    return fnAsync(path, data, o);
};

/**
 * Synchronously writes binary data to a file.
 * @param path The path to the file.
 * @param data The binary data to write.
 * @param options The options for writing the file (optional).
 */
export function writeFileSync(
    path: string | URL,
    data: Uint8Array,
    options?: WriteOptions | undefined,
): void {
    if (DENO) {
        return Deno.writeFileSync(path, data, options);
    }

    if (!fn) {
        fn = loadFs()?.writeFileSync;
        if (!fn) {
            throw new Error("fs.writeFileSync is not available");
        }
    }

    const o : Record<string, unknown> = {};
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
        
        options.signal.onabort = () => {
            c.abort();
        }

        o.signal = c.signal;
    }
    
    return fn(path, data, o);
};