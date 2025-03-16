import { test } from "@bearz/testing";
import { ok, throws, rejects } from "@bearz/assert";
import { remove, removeSync } from "./remove.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::remove deletes a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test1.txt");
    
    try {
        await exec("bash", ["-c", `echo "test content" > ${filePath}`]);
        await remove(filePath);
        const exists = await output("test", ["-f", filePath]).then(() => true).catch(() => false);
        ok(!exists, "File should be deleted");
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::removeSync deletes a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test2.txt");
    
    try {
        await exec("bash", ["-c", `echo "test content" > ${filePath}`]);
        removeSync(filePath);
        const exists = await output("test", ["-f", filePath]).then(() => true).catch(() => false);
        ok(!exists, "File should be deleted");
    } finally {
        await exec("rm", ["-rf", testData]);
    }
});

test("fs::remove with non-existent file throws error", async () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    await rejects(() => remove(nonExistentPath));
});

test("fs::removeSync with non-existent file throws error", () => {
    const nonExistentPath = join(testData, "non-existent.txt");
    throws(() => removeSync(nonExistentPath));
});

test("fs::remove uses Deno.remove when available", async () => {
    const { Deno: originalDeno } = globals;
    let removeCalled = false;
    delete g["Deno"];
    
    try {
        g.Deno = {
            remove: () => {
                removeCalled = true;
                return Promise.resolve();
            }
        };
        
        await remove("test.txt");
        ok(removeCalled, "Deno.remove should be called");
    } finally {
        globals.Deno = originalDeno;
    }
});

test("fs::removeSync uses Deno.removeSync when available", () => {
    const { Deno: originalDeno } = globals;
    delete g["Deno"];
    let removeSyncCalled = false;
    
    try {
        g.Deno = {
            removeSync: () => {
                removeSyncCalled = true;
            }
        };
        
        removeSync("test.txt");
        ok(removeSyncCalled, "Deno.removeSync should be called");
    } finally {
        globals.Deno = originalDeno;
    }
});