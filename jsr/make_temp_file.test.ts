import { test } from "@bearz/testing";
import { ok, equal } from "@bearz/assert";
import { makeTempFile, makeTempFileSync } from "./make_temp_file.ts";
import { exec, execSync } from "./_testutils.ts";
import { dirname, join } from "@bearz/path";
import { globals } from "./globals.ts";
import { makeDir } from "./make_dir.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;
const testData = join(import.meta.dirname!, "test-data");

function exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        exec("test", ["-f", path])
            .then((code) => resolve(code === 0))
            .catch(() => resolve(false));
    });
}

function existsSync(path: string): boolean {
    try {
        
        return execSync("test", ["-f", path]) === 0;
    } catch {
        return false;
    }
}

test("fs::makeTempFile creates a temporary file with default options", async () => {
    const file = await makeTempFile();
    console.log(file);
    ok(await exists(file), "File should exist");
    await exec("rm", ["-f", file]);
});

test("fs::makeTempFile creates a file with custom prefix and suffix", async () => {
    const file = await makeTempFile({ prefix: "test-", suffix: ".txt" });
    ok(await exists(file));
    ok(file.startsWith(join(g.process.env.TMPDIR ?? "/tmp", "test-")));
    ok(file.endsWith(".txt"));
    await exec("rm", ["-f", file]);
});

test("fs::makeTempFile creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp");
    await makeDir(customDir, { recursive: true });
    const file = await makeTempFile({ dir: customDir });
    ok(await exists(file), `File ${file} should exist in ${customDir}`);
    ok(file.includes(customDir));
    const dir = dirname(file);
    await exec("rm", ["-rf", dir]);
});

test("fs::makeTempFileSync creates a temporary file with default options", async () => {
    const file = makeTempFileSync();
    ok(existsSync(file));
    await exec("rm", ["-f", file]);
});

test("fs::makeTempFileSync creates a file with custom prefix and suffix", async () => {
    const file = makeTempFileSync({ prefix: "test-", suffix: ".txt" });
    ok(existsSync(file));
    ok(file.startsWith(join(g.process.env.TMPDIR ?? "/tmp", "test-")));
    ok(file.endsWith(".txt"));
    await exec("rm", ["-f", file]);
});

test("fs::makeTempFileSync creates a file in custom directory", async () => {
    const customDir = join(testData, "custom-temp-sync");
    await makeDir(customDir, { recursive: true });
    const file = makeTempFileSync({ dir: customDir });
    ok(existsSync(file));
    ok(file.includes(customDir));
    await exec("rm", ["-rf", join(g.process.env.TMPDIR ?? "/tmp", customDir)]);
});

test("fs::makeTempFile uses Deno.makeTempFile when available", async () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file";
    try {
        g.Deno = {
            makeTempFile: () => Promise.resolve(testFile)
        };
        const file = await makeTempFile();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});

test("fs::makeTempFileSync uses Deno.makeTempFileSync when available", () => {
    const originalDeno = g.Deno;
    delete g["Deno"];
    const testFile = "/tmp/test-deno-file-sync";
    try {
        g.Deno = {
            makeTempFileSync: () => testFile
        };
        const file = makeTempFileSync();
        equal(file, testFile);
    } finally {
        g.Deno = originalDeno;
    }
});