import { test } from "@bearz/testing";
import { equal, ok, rejects } from "@bearz/assert";
import { makeDir, makeDirSync } from "./make_dir.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";
import { statSync } from "./stat.ts";
import { removeSync } from "./remove.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::makeDir creates a directory", async () => {
    const dirPath = join(testData, "new-dir");

    try {
        await makeDir(dirPath);
        const o = await output("test", ["-d", dirPath]);
        equal(o.code, 0);
    } finally {
        await exec("rm", ["-rf", dirPath]);
    }
});

test("fs::makeDir throws when directory already exists", async () => {
    const dirPath = join(testData, "existing-dir");

    try {
        await exec("mkdir", ["-p", dirPath]);
        await rejects(async () => await makeDir(dirPath));
    } finally {
        await exec("rm", ["-rf", dirPath]);
    }
});

test("fs::makeDir uses Deno.mkdir when available", async () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        let called = false;
        g.Deno = {
            mkdir: () => {
                called = true;
            },
        };
        await makeDir("test");
        ok(called);
    } finally {
        globals.Deno = od;
    }
});

test("fs::makeDirSync creates a directory synchronously", () => {
    const dirPath = join(testData, "new-dir-sync");

    try {
        makeDirSync(dirPath);
        const result = statSync(dirPath);
        ok(result.isDirectory);
    } finally {
        removeSync(dirPath, { recursive: true });
    }
});

test("fs::makeDirSync uses Deno.mkdirSync when available", () => {
    const { Deno: od } = globals;
    delete g["Deno"];

    try {
        let called = false;
        g.Deno = {
            mkdirSync: () => {
                called = true;
            },
        };
        makeDirSync("test");
        ok(called);
    } finally {
        globals.Deno = od;
    }
});
