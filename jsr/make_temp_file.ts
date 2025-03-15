import type { MakeTempOptions } from "./types.ts";
import { DENO, WIN, globals, loadFs, loadFsAsync } from "./globals.ts";
import { join, isAbsolute }  from "@bearz/path";
import { exists, existsSync } from "./exists.ts";
import { makeDir, makeDirSync } from "./make_dir.ts";


let fn: typeof import('node:fs').writeFileSync | undefined = undefined;
let fnAsync: typeof import('node:fs/promises').writeFile | undefined = undefined;

function randomName(prefix?: string, suffix?: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const rng = crypto.getRandomValues(new Uint8Array(12));
    const name = Array.from(rng)
        .map((x) => chars[x % chars.length])
        .join("");

    if (prefix && suffix) {
        return `${prefix}-${name}${suffix}`;
    }

    if (prefix) {
        return `${prefix}-${name}`;
    }

    if (suffix) {
        return `${name}${suffix}`;
    }

    return name;
}

/**
 * Creates a temporary file.
 * @param options The options for creating the temporary file (optional).
 * @returns A promise that resolves with the path to the created temporary file.
 */
export async function makeTempFile(options?: MakeTempOptions): Promise<string> {
    if (DENO) {
        return globals.Deno.makeTempFile(options);
    }

    if (!fnAsync) {
        fnAsync = loadFsAsync()?.writeFile;
        if (!fnAsync) {
            throw new Error("fs.promises.writeFile is not available");
        }
    }

    options ??= {};
    options.prefix ??= "tmp";
    let dir: string;
    if (!options.dir) {
        dir = WIN ? (globals.process.env.TEMP ?? "c:\\Temp") : (globals.process.env.TMPDIR ?? "/tmp");
    } else if (options.dir && !isAbsolute(options.dir)) {
        dir = WIN ? (globals.process.env.TEMP ?? "c:\\Temp") : (globals.process.env.TMPDIR ?? "/tmp");
        dir = join(dir, options.dir);
    } else {
        dir = options.dir;
    }

    const r = randomName(options.prefix, options.suffix);
    const file = join(dir, r);
    if (!await exists(dir)) {
        await makeDir(dir, { recursive: true });
    }

    await fnAsync(file, new Uint8Array(0), { mode: 0o644 });
    return file;
};

/**
 * Creates a temporary file synchronously.
 * @param options The options for creating the temporary file (optional).
 * @returns The path to the created temporary file.
 */
export function makeTempFileSync(options?: MakeTempOptions): string {
    if (DENO) {
        return globals.Deno.makeTempFileSync(options);
    }

    if (!fn) {
        fn = loadFs()?.writeFileSync;
        if (!fn) {
            throw new Error("fs.writeFileSync is not available");
        }
    }

    options ??= {};
    options.prefix ??= "tmp";
    let dir: string;
    if (!options.dir) {
        dir = WIN ? (globals.process.env.TEMP ?? "c:\\Temp") : (globals.process.env.TMPDIR ?? "/tmp");
    } else if (options.dir && !isAbsolute(options.dir)) {
        dir = WIN ? (globals.process.env.TEMP ?? "c:\\Temp") : (globals.process.env.TMPDIR ?? "/tmp");
        dir = join(dir, options.dir);
    } else {
        dir = options.dir;
    }

    const r = randomName(options.prefix, options.suffix);
    const file = join(dir, r);
    if (!existsSync(dir)) {
        makeDirSync(dir, { recursive: true });
    }

    fn(file, new Uint8Array(0), { mode: 0o644 });
    return file;
};