import { test } from "@bearz/testing";
import { throws, rejects, equal, notEqual } from "@bearz/assert";
import { chown, chownSync } from "./chown.ts";
import { globals } from "./globals.ts";
import { exec, output } from "./_testutils.ts";
import { join } from "@bearz/path";
import { uid } from "./uid.ts";

const testFile1 = join(import.meta.dirname!, "chown_test.txt");
const testFile2 = join(import.meta.dirname!, "chown_test2.txt");
const cu = uid()

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("chown::chown throws when no suitable fs module found", async () => {
    // Temporarily override globals
  
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        await rejects(
            async () => {
                await chown(testFile1, 1000, 1000);
            },
            Error,
            "No suitable file system module found."
        );

    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("chown::chownSync throws when no suitable fs module found", () => {
    // Temporarily override globals
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];

    try {
        throws(
            () => {
                chownSync(testFile1, 1000, 1000);
            },
            Error,
            "No suitable file system module found."
        );
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("chown::chown changes the owner async", { skip: (cu === null || cu !== 0) }, async () => {
    

    await exec("touch", [testFile2]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile2]);
        await chown(testFile2, 1000, 1000);
        const o = await output("stat", ["-c", "%u:%g", testFile2]);
        const uid = parseInt(o.stdout.split(":")[0]);
        const gid = parseInt(o.stdout.split(":")[1]);
        console.log(o.stdout);
        notEqual(uid, Number.NaN);
        notEqual(gid, Number.NaN);
        // 1000 in decimal = 0o1750 in octal
        equal(uid, 1000);
        equal(gid, 1000);
    } finally {

        await exec("rm", ["-f", testFile2]);
    }
});

test("chown::chownSync changes the owner", { skip: (cu === null || cu !== 0) }, async () => {
    await exec("touch", [testFile1]);

    try {
        await exec("sudo", ["chown", "nobody:nogroup", testFile1]);
        chownSync(testFile1, 1000, 1000);
        const o = await output("stat", ["-c", "%u:%g", testFile1]);
        const uid = parseInt(o.stdout.split(":")[0]);
        const gid = parseInt(o.stdout.split(":")[1]);
        notEqual(uid, Number.NaN);
        notEqual(gid, Number.NaN);
        // 1000 in decimal = 0o1750 in octal
        equal(uid, 1000);
        equal(gid, 1000);
    } finally {

        await exec("rm", ["-f", testFile1]);
    }
});