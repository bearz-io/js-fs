import { dirname, fromFileUrl } from "jsr:@std/path@1";

const __dirname = dirname(fromFileUrl(import.meta.url));
const pwd = dirname(__dirname);

export async function deleteShim(path: string) {
    await Deno.remove(path);
}

export async function replaceGlobalsFile(path: string) {
    const content = `export const globals = globalThis;

export const WIN = globals.process && globals.process.platform === 'win32' || globals.navigator && globals.navigator.userAgent.includes('Windows');

export function loadFs() {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule('node:fs');
    } else if (globals.Bun && typeof require !== 'undefined') {
        try {
            return require('node:fs');
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}

export function loadFsAsync()  {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule('node:fs/promises');
    } else if (globals.Bun && typeof require !== 'undefined') {
        try {
            return require('node:fs/promises');
        } catch (e) {
            console.log(e);
            // Ignore error
        }
    }

    return undefined;
}    
    
    `;

    await Deno.writeTextFile(path, content);
}

export async function replaceGlobalsTypeFile(path: string) {
    const content = `export declare const globals: typeof globalThis & Record<string, any>;
// deno-lint-ignore no-explicit-any
export const globals : typeof globalThis & Record<string, any> = globalThis as any;

export declare const WIN : boolean;
export declare function loadFs() : typeof import('node:fs') | undefined;
export declare function loadFsAsync() : typeof import('node:fs/promises') | undefined;
    
`;

    await Deno.writeTextFile(path, content);
}

await replaceGlobalsTypeFile(`${pwd}/npm/types/globals.d.ts`);
await replaceGlobalsFile(`${pwd}/npm/esm/globals.js`);
await deleteShim(`${pwd}/npm/esm/_dnt.shims.js`);
await deleteShim(`${pwd}/npm/types/_dnt.shims.d.ts`);
