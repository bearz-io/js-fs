import { test } from "@bearz/testing";
import { equal, rejects, throws } from "@bearz/assert";
import { symlink, symlinkSync } from "./symlink.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::symlink creates a symbolic link to a file", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "source1.txt");
    const linkPath = join(testData, "link1.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        await symlink(sourcePath, linkPath);
        
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::symlink throws when globals.Deno is undefined and Node.js fs.promises.symlink is unavailable", async () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    try {
        await rejects(
            () => symlink("source", "dest"),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::symlinkSync creates a symbolic link to a file", async () => {
    await exec("mkdir", ["-p", testData]);

    const sourcePath = join(testData, "source2.txt");
    const linkPath = join(testData, "link2.txt");
    const content = "test content sync";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${sourcePath}`]);
        symlinkSync(sourcePath, linkPath);
        
        const o = await output("cat", [linkPath]);
        const linkedContent = o.stdout.trim();
        equal(linkedContent, content);
    } finally {
        await exec("rm", ["-f", sourcePath, linkPath]);
    }
});

test("fs::symlinkSync throws when globals.Deno is undefined and Node.js fs.symlinkSync is unavailable", () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
 
    
    try {
        throws(
            () => symlinkSync("source", "dest"),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});