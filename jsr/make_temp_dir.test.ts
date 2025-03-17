import { test } from "@bearz/testing";
import { equal, ok } from "@bearz/assert";
import { makeTempDir, makeTempDirSync } from "./make_temp_dir.ts";
import { globals } from "./globals.ts";

import { exec, execSync } from "./_testutils.ts";
import { makeDir } from "./make_dir.ts";
import { remove } from "./remove.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

function exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        exec("test", ["-d", path])
            .then((code) => resolve(code === 0))
            .catch(() => resolve(false));
    });
}

function existsSync(path: string): boolean {
    try {
        return execSync("test", ["-d", path]) === 0;
    } catch {
        return false;
    }
}

test("fs::makeTempDir creates temporary directory with default options", async () => {
    const tempDir = await makeTempDir();
    ok(await exists(tempDir));
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory with prefix", async () => {
    const tempDir = await makeTempDir({ prefix: "test-" });
    ok(await exists(tempDir));
    ok(tempDir.includes("test-"), `Expected prefix 'test-' in ${tempDir}`);
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory with suffix", async () => {
    const tempDir = await makeTempDir({ suffix: "-tmp" });
    ok(await exists(tempDir));
    ok(tempDir.endsWith("-tmp"), `Expected suffix '.tmp' in ${tempDir}`);
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDir creates directory in specified dir", async () => {
    const baseDir = "/tmp/test-base";
    await makeDir(baseDir, { recursive: true });
    const tempDir = await makeTempDir({ dir: baseDir });
    ok(tempDir.startsWith(baseDir));
    ok(await exists(tempDir));
    await remove(baseDir, { recursive: true });
});

test("fs::makeTempDir uses Deno.makeTempDir when available", async () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    try {
        g.Deno = {
            makeTempDir: () => Promise.resolve("/fake/temp/dir"),
        };
        const dir = await makeTempDir();
        equal(dir, "/fake/temp/dir");
    } finally {
        globals.Deno = od;
    }
});

test("fs::makeTempDirSync creates temporary directory with default options", async () => {
    const tempDir = makeTempDirSync();
    ok(existsSync(tempDir));
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory with prefix", async () => {
    const tempDir = makeTempDirSync({ prefix: "test-" });
    ok(existsSync(tempDir));
    ok(tempDir.includes("test-"));
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory with suffix", async () => {
    const tempDir = makeTempDirSync({ suffix: "-tmp" });
    ok(existsSync(tempDir));
    ok(tempDir.endsWith("-tmp"));
    await remove(tempDir, { recursive: true });
});

test("fs::makeTempDirSync creates directory in specified dir", async () => {
    const baseDir = "/tmp/test-base";
    await makeDir(baseDir, { recursive: true });
    const tempDir = makeTempDirSync({ dir: baseDir });
    ok(tempDir.startsWith(baseDir));

    ok(existsSync(tempDir));
    await remove(baseDir, { recursive: true });
});

test("fs::makeTempDirSync uses Deno.makeTempDirSync when available", () => {
    const { Deno: od } = globals;
    delete g["Deno"];
    try {
        g.Deno = {
            makeTempDirSync: () => "/fake/temp/dir",
        };
        const dir = makeTempDirSync();
        equal(dir, "/fake/temp/dir");
    } finally {
        globals.Deno = od;
    }
});
