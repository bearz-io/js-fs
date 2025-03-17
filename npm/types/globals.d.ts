export declare const globals: typeof globalThis & Record<string, any>;
// deno-lint-ignore no-explicit-any
export const globals: typeof globalThis & Record<string, any> = globalThis as any;

export declare const WIN: boolean;
export declare function loadFs(): typeof import("node:fs") | undefined;
export declare function loadFsAsync(): typeof import("node:fs/promises") | undefined;
