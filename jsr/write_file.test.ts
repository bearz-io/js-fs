import { test } from "@bearz/testing";
import { equal, rejects } from "@bearz/assert";
import { writeFile, writeFileSync } from "./write_file.ts";
import { join } from "@bearz/path";
import { exec, output } from "./_testutils.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

const testData = join(import.meta.dirname!, "test-data");

test("fs::writeFile writes data to a file", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "test.txt");
    const content = new TextEncoder().encode("test content");

    try {
        await writeFile(filePath, content);
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), "test content");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeFile appends data when append option is true", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "append.txt");
    const content1 = new TextEncoder().encode("first ");
    const content2 = new TextEncoder().encode("second");

    try {
        await writeFile(filePath, content1);
        await writeFile(filePath, content2, { append: true });
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), "first second");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeFile handles ReadableStream input", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "stream.txt");
    const content = "stream content";
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(content));
            controller.close();
        }
    });

    try {
        await writeFile(filePath, stream);
        const o = await output("cat", [filePath]);
        equal(o.stdout.trim(), content);
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeFileSync writes data to a file synchronously", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "sync.txt");
    const content = new TextEncoder().encode("sync content");

    try {
        writeFileSync(filePath, content);
        const result = await output("cat", [filePath]);
        equal(result.stdout.trim(), "sync content");
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeFile handles abort signal", async () => {
    await exec("mkdir", ["-p", testData]);
    const filePath = join(testData, "abort.txt");
    const content = new TextEncoder().encode("abort content");
    const controller = new AbortController();

    try {
        controller.abort();
        await rejects(
            async () => await writeFile(filePath, content, { signal: controller.signal }),
            Error,
        );
    } finally {
        await exec("rm", ["-f", filePath]);
    }
});

test("fs::writeFile throws when file system APIs unavailable", async () => {
    const { Deno: od, process: proc, require: req } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];

    try {
        await rejects(
            () => writeFile("test.txt", new Uint8Array()),
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});