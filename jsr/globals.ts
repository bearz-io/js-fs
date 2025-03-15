// deno-lint-ignore no-explicit-any
export const globals : typeof globalThis & Record<string, any> = globalThis as any;

export const DENO = globals.Deno !== undefined;
export const WIN = globals.process && globals.process.platform === 'win32' || globals.navigator && globals.navigator.userAgent.includes('Windows');

export function loadFs() : typeof import('node:fs') | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule('node:fs') as typeof import('node:fs');
    } else if (globals.require !== undefined) {
        try {
            return globals.require('node:fs') as typeof import('node:fs');
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}

export function loadFsAsync() : typeof import('node:fs/promises') | undefined {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule('node:fs/promises') as typeof import('node:fs/promises');
    } else if (globals.require !== undefined) {
        try {
            return globals.require('node:fs/promises') as typeof import('node:fs/promises');
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}