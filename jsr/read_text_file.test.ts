import { test } from "@bearz/testing";
import { equal, rejects, throws } from "@bearz/assert";
import { readTextFile, readTextFileSync } from "./read_text_file.ts";
import { globals } from "./globals.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::readTextFile reads file contents as text", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test1.txt");
    const content = "Hello World";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const text = await readTextFile(filePath);
        equal(text.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});



test("fs::readTextFile with signal aborts when requested", async () => {
    const controller = new AbortController();
    const filePath = join(testData, "test3.txt");
    controller.abort();

    await rejects(
        () => readTextFile(filePath, { signal: controller.signal }),
        Error
    );
});

test("fs::readTextFileSync reads file contents as text", async () => {
    const filePath = join(testData, "test4.txt");
    const content = "Hello Sync";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const text = readTextFileSync(filePath);
        equal(text.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});



test("fs::readTextFileSync throws when no suitable fs module found", () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    
    try {
        throws(
            () => readTextFileSync("test.txt"),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});