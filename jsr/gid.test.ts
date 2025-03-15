import { test } from "@bearz/testing";
import { equal } from "@bearz/assert";
import { gid } from "./gid.ts";
import { globals } from "./globals.ts";

// deno-lint-ignore no-explicit-any
const g = globals as Record<string, any>;

test("fs::gid returns number when Deno.gid exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = {
            gid: () => 1000
        };
        equal(gid(), 1000);
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::gid returns number when process.getgid exists", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = undefined;
        g.process = {
            getgid: () => 1000
        };
        equal(gid(), 1000);
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::gid returns null when process.getgid returns undefined", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = undefined;
        g.process = {
            getgid: () => undefined
        };
        equal(gid(), null);
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});

test("fs::gid returns null when no runtime APIs available", () => {
    const { Deno: od, process: proc, require: req  } = globals;
    delete g["Deno"];
    delete g["process"];
    delete g["require"];
    try {
        g.Deno = undefined;
        g.process = undefined;
        equal(gid(), null);
    } finally {
        globals.Deno = od;
        globals.process = proc;
        globals.require = req;
    }
});