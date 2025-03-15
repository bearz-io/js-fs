import type { DirectoryInfo } from "./types.ts";
import { join } from "@bearz/path";
import { DENO, globals, loadFs, loadFsAsync } from "./globals.ts";



let fn: typeof import('node:fs').readdirSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').readdir | undefined = undefined;
let lstat: typeof import('node:fs').lstatSync | undefined = undefined;
let lstatAsync: typeof import('node:fs/promises').lstat | undefined = undefined;

/**
 * Reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An async iterable that yields directory information.
 */
export function readDir(
    path: string | URL, options = { 
        /**
         * Whether to log debug information.
         * @default false
         */
        debug: false 
    }
): AsyncIterable<DirectoryInfo> {
    if (DENO) {
        return globals.Deno.readDir(path);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.readdir;
        if (!fnAsync) {
            throw new Error("fs.promises.readdir is not available");
        }
    }

    if (!lstatAsync) {
        lstatAsync = loadFsAsync()?.lstat;
        if (!lstatAsync) {
            throw new Error("fs.promises.lstat is not available");
        }
    }

    if (path instanceof URL) {
        path = path.toString();
    }

    const iterator = async function* () {
            const data = await fnAsync!(path);
            for (const d of data) {
                const next = join(path, d);
                try {
                    const info = await lstatAsync!(join(path, d));
                    yield {
                        name: d,
                        isFile: info.isFile(),
                        isDirectory: info.isDirectory(),
                        isSymlink: info.isSymbolicLink(),
                    };
                } catch (e) {
                    if (options.debug && e instanceof Error) {
                        const message = e.stack ?? e.message;
                        const e2 = e as NodeJS.ErrnoException;
                        if (e2.code) {
                            console.debug(`Failed to lstat ${next}\n${e2.code}\n${message}`);
                        } else {
                            console.debug(`Failed to lstat ${next}\n${message}`);
                        }
                    }
                }
            }
        };

    return iterator();
};

/**
 * Synchronously reads the contents of a directory.
 * @param path The path to the directory.
 * @returns An iterable that yields directory information.
 */
export function* readDirSync(
    path: string | URL,
    options = { 
        /**
         * Whether to log debug information.
         * @default false
         */
        debug: false 
    }
): Iterable<DirectoryInfo> {
    if (DENO) {
        return globals.Deno.readDirSync(path);
    }

    if (path instanceof URL) {
        path = path.toString();
    }

    if (!fn) {
        fn = loadFs()?.readdirSync;
        if (!fn) {
            throw new Error("fs.readdirSync is not available");
        }
    }

    if (!lstat) {
        lstat = loadFs()?.lstatSync;
        if (!lstat) {
            throw new Error("fs.lstatSync is not available");
        }
    }

    const data = fn!(path);
    for (const d of data) {
        const next = join(path, d);
        try {
            const info = lstat!(next);
            yield {
                name: d,
                isFile: info.isFile(),
                isDirectory: info.isDirectory(),
                isSymlink: info.isSymbolicLink(),
            };
        } catch (e) {
            if (options.debug && e instanceof Error) {
                const message = e.stack ?? e.message;
                const e2 = e as NodeJS.ErrnoException;
                if (e2.code) {
                    console.debug(`Failed to lstat ${next}\n${e2.code}\n${message}`);
                } else {
                    console.debug(`Failed to lstat ${next}\n${message}`);
                }
            }
        }
    }
};
