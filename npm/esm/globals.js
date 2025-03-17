export const globals = globalThis;

export const WIN = globals.process && globals.process.platform === "win32" ||
    globals.navigator && globals.navigator.userAgent.includes("Windows");

export function loadFs() {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule("node:fs");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs");
        } catch (_) {
            // Ignore error
        }
    }

    return undefined;
}

export function loadFsAsync() {
    if (globals.process && globals.process.getBuiltinModule) {
        return globals.process.getBuiltinModule("node:fs/promises");
    } else if (globals.Bun && typeof require !== "undefined") {
        try {
            return require("node:fs/promises");
        } catch (e) {
            console.log(e);
            // Ignore error
        }
    }

    return undefined;
}
