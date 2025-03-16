import { test } from "@bearz/testing";
import { equal, ok, throws, rejects } from "@bearz/assert";
import { readFile, readFileSync } from "./read_file.ts";
import { join } from "@bearz/path";
import { exec } from "./_testutils.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::readFile reads file contents", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");
    const content = "test content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const data = await readFile(filePath);
        ok(data instanceof Uint8Array);
        equal(new TextDecoder().decode(data).trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::readFile with aborted signal rejects", async () => {
    const controller = new AbortController();
    controller.abort();
    await rejects(
        () => readFile("test.txt", { signal: controller.signal }),
        Error
    );
});



test("fs::readFileSync reads file contents", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test-sync.txt");
    const content = "test sync content";

    try {
        await exec("bash", ["-c", `echo "${content}" > ${filePath}`]);
        const data = readFileSync(filePath);
        ok(data instanceof Uint8Array);
        equal(new TextDecoder().decode(data).trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::readFileSync without Deno API throws when no fs available", () => {
    const { Deno: od, require: req, process: proc } = globals;
    delete g["Deno"];
    delete g["require"];
    delete g["process"];
    
    try {
        throws(() => readFileSync("test.txt"), Error, "No suitable file system module found.");
    } finally {
        globals.Deno = od;
        globals.require = req;
        globals.process = proc;
    }
});