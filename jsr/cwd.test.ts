import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { cwd } from "./cwd.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("fs::cwd returns deno cwd when globals.Deno exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = {
            cwd: () => "/test/deno/path"
        };
        equal(cwd(), "/test/deno/path");
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::cwd returns process.cwd when globals.process exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = undefined;
        g.process = {
            cwd: () => "/test/process/path"
        };
        equal(cwd(), "/test/process/path");
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::cwd returns empty string when neither Deno nor process exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = undefined;
        g.process = undefined;
        equal(cwd(), "");
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});