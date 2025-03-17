/**
 * ## Overview
 *
 * The fs module provides an file system API that works in deno,
 * bun, and nodejs to promote creating cross-runtime packages/modules
 * for TypeScript/JavaScript.
 *
 * The API is heavily influenced by Deno's file system APIs which
 * are built on modern web standards which includes
 * promises, iterator, and async iterator did not exist in node
 * when the api was created.  This module gets rid of the
 * need to import "fs/promises".
 *
 * The module will still load functions if called from the browser
 * or runtimes outside of node, bun, and deno.  However, the functions
 * will throw `Not implemented` errors when called.
 *
 * To use the lock and seek methods on the File object returned from
 * the `open` method in runtimes outside of Deno, you'll need to implement
 * the methods by importing `@bearz/fs/ext` and setting the methods.
 *
 * This was done to avoid a hard dependency on npm's fs-extra module.
 * An additional bearz module may be created at a later date to handle that.
 *
 * The module includes the same functions found in deno's `@std/fs` module
 * but instead of only supporting deno file system calls, it uses the
 * this module's abstraction layer which supports deno, bun, and node.
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@bearz/fs/doc)
 *
 * ## Usage
 * ```typescript
 * import { makeDir, writeTextFile, remove } from "@bearz/fs"
 *
 * await makeDir("/home/my_user/test");
 * await writeTextFile("/home/my_user/test/log.txt",  "ello");
 * await remove("/home/my_user/test", { recursive: true });
 *
 * ```
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 */
import "./_dnt.polyfills.js";
export * from "./types.js";
export * from "./chmod.js";
export * from "./chown.js";
export * from "./copy_file.js";
export * from "./copy.js";
export * from "./cwd.js";
export * from "./empty_dir.js";
export * from "./ensure_dir.js";
export * from "./ensure_file.js";
export * from "./ensure_link.js";
export * from "./ensure_symlink.js";
export * from "./errors.js";
export * from "./exists.js";
export * from "./expand_glob.js";
export * from "./gid.js";
export * from "./is_dir.js";
export * from "./is_file.js";
export * from "./link.js";
export * from "./lstat.js";
export * from "./make_dir.js";
export * from "./make_temp_dir.js";
export * from "./make_temp_file.js";
export * from "./move.js";
export * from "./open.js";
export * from "./read_dir.js";
export * from "./read_file.js";
export * from "./read_link.js";
export * from "./read_text_file.js";
export * from "./realpath.js";
export * from "./remove.js";
export * from "./rename.js";
export * from "./stat.js";
export * from "./symlink.js";
export * from "./uid.js";
export * from "./utime.js";
export * from "./walk.js";
export * from "./write_file.js";
export * from "./write_text_file.js";
