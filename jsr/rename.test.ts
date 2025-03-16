import { test } from "@bearz/testing";
import { equal, throws, rejects } from "@bearz/assert";
import { rename, renameSync } from "./rename.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::rename renames a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const oldPath = join(testData, "old.txt");
    const newPath = join(testData, "new.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${oldPath}`]);
        await rename(oldPath, newPath);
        
        const o = await output("cat", [newPath]);
        const renamedContent = o.stdout.trim();
        equal(renamedContent, content);
    } finally {
        await exec("rm", ["-f", oldPath, newPath]);
    }
});

test("fs::rename throws when using node.js and no suitable fs module found", async () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    try {
        await rejects(
            () => rename("old.txt", "new.txt"),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::renameSync renames a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const oldPath = join(testData, "old-sync.txt");
    const newPath = join(testData, "new-sync.txt");
    const content = "test content sync";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${oldPath}`]);
        renameSync(oldPath, newPath);
        
        const o = await output("cat", [newPath]);
        const renamedContent = o.stdout.trim();
        equal(renamedContent, content);
    } finally {
        await exec("rm", ["-f", oldPath, newPath]);
    }
});

test("fs::renameSync throws when using node.js and no suitable fs module found", () => {
    const { Deno: od, process: proc, require: req } = globals;
        delete g["Deno"];
        delete g["process"];
        delete g["require"];
    
    try {
        throws(
            () => renameSync("old.txt", "new.txt"),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});