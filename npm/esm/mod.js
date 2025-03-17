/**
## Overview
 *
 * The fs module provides a modern file system API that works in Deno,
 * Bun, and NodeJs to promote creating cross-runtime packages/modules
 * for TypeScript/JavaScript.
 *
 * ![logo](https://raw.githubusercontent.com/bearz-io/js/refs/heads/main/eng/assets/bearz.io.png)
 *
 * [![JSR](https://jsr.io/badges/@bearz/fs)](https://jsr.io/@bearz/fs)
 * [![npm version](https://badge.fury.io/js/@bearz%2Ffs.svg)](https://badge.fury.io/js/@bearz%2Ffs)
 * [![GitHub version](https://badge.fury.io/gh/bearz-io%2Fjs-fs.svg)](https://badge.fury.io/gh/bearz-io%2Fjs-fs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@bearz/fs/doc)
 *
 * A list of other modules can be found at [github.com/bearz-io/js](https://github.com/bearz-io/js)
 *
 * ## Usage
 *
 * ```typescript
 * import { makeDir, writeTextFile, remove } from "@bearz/fs"
 *
 *
 * await makeDir("/home/my_user/test");
 * await writeTextFile("/home/my_user/test/log.txt",  "ello");
 * await remove("/home/my_user/test", { recursive: true });
 * ```
 *
 * ## Classes
 *
 * - `AlreadyExistsError` - An error thrown when a file already exists.
 * - `FsFile` - The type returned by `open` and `openSync`.
 * - `NotFoundError` - An error thrown when a file or directory is not found.
 *
 * ## Functions
 *
 * - `chmod` &amp; `chmodSync` - Changes the mode for the given file or directory on a posix system.
 * - `chown` &amp; `chownSync` - Changes the owner for the given file or directory on a posix system.
 * - `copyFile` &amp; `copyFileSync` - Copies a file from the current path to the desintation.
 * - `copy` &amp; `copySync` - Copies a file, directory, or symlink to the destination.
 * - `cwd` - Gets the current working directory.
 * - `emptyDir` &amp; `emptyDirSync` - Clears all the child items in a directory.
 * - `ensureDir` &amp; `ensureDirSync` - Ensure that a directory exists or is created if needed.
 * - `ensureFile` &amp; `ensureFileSync` - Ensure that a file exits or is created if needed.
 * - `ensureSymlink` &amp; `ensureSymlinkSync` - Ensures that a symlink exists or is created if needed.
 * - `exists` &amp; `existsSync` - Determines if a file or directory exists.
 * - `isNotFoundError` - Determines if an error is NotFoundError, NotFound, or node error with a code of `ENOENT`.
 * - `isAlreadyExistsError` - Determines if an error is an AlreadyExistsError,
 *     AlreadyExists, or node error with a code of `EEXIST`.
 * - `expandGlob` &amp; `expandGlobSync` -  Gets files and/or directories that
 *    matches the glob against the root direcory provided. root directory defaults to the
 *    current working directory.
 * - `gid` - Gets the group id for the current user for the process (posix only).
 * - `isDir` &amp; `isDirSync` - Determines if a path exists and is a directory.
 * - `isFile` &amp; `isFile` - Determines if a path exists and is a file.
 * - `link` &amp; `linkSync` - Creates a hard link.
 * - `lstat` &amp; `lstatSync` - Invokes link stat on path to get system system information.
 * - `makeDir` &amp; `makeDirSync` - Creates a new directory.
 * - `makeTempDir` &amp; `makeTempDirSync` - Creates a new temporary directory.
 * - `makeTempFile` &amp; `makeTempFileSync` - Creates a new temporary file.
 * - `move` &amp; `moveSync` - Moves a file, directory, or symlink to the destination.
 * - `open` &amp; `openSync` - Opens a file and returns an instance of `FsFile` which
 *    includes multiple methods of working with a file such as seek, lock, read, write,
 *    stat, etc. Reand and write only reads/writes a chunk of data is more akin to
 *    to a stream.
 * - `readDir` &amp; `readDirSync` - Reads a directory and returns an iterator of
 *    DirectoryInfo. This is not recursive.
 * - `readFile` &amp; `readFileSync` - Reads the data of a file as `Uint8Array` (binary).
 * - `readLink` &amp; `readLinkSync` - Reads the link and gets source path.
 * - `readTextFile` &amp; `readTextFile` - Reads a file that is utf-8 and returns the contents
 *    as a string.
 * - `remove` &amp; `removeSync` - Deletes a directory, file, or symlink from the file system.
 * - `rename` &amp; `renameSync` - Renames a directory, file, or symlink.
 * - `stat` &amp; `statSync` - Gets a file or directories file system information.
 * - `symlink` &amp; `symlinkSync` - Creates a new symlink (soft) link.
 * - `uid` - Gets the user id for the current user of the process. (posix only).
 * - `utime` &amp; `utimeSync` - Changes the creation and modfication dates for a file or directory.
 * - `walk` &amp; `walkSync` - Iterates over a directory structure recursively.
 * - `writeFile` &amp; `writeFileSync` - Writes Uint8Array (binary) to a given file path.
 * - `writeTextFile` &amp; `writeTextFileSync` - Writes a string to a given file path as utf-8 encoded data.
 *
 * ## Notes
 *
 * The API is heavily influenced by Deno's file system APIs which
 * are built on modern web standards which includes
 * promises, iterator, and async iterator did not exist in node
 * when the api was created.  This module gets rid of the
 * need to import "fs/promises".
 *
 * The module will still load functions if called from the browser
 * or runtimes outside of node, bun, and deno.  However, the functions
 * will throw errors when called.
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
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * [Deno MIT License](https://jsr.io/@std/fs/1.0.14/LICENSE)
 * @module
 */
// TODO: Write module code here
import "./_dnt.polyfills.js";
export * from "./types.js";
export * from "./chmod.js";
export * from "./chown.js";
export * from "./copy_file.js";
export * from "./copy.js";
export * from "./empty_dir.js";
export * from "./ensure_dir.js";
export * from "./ensure_file.js";
export * from "./ensure_link.js";
export * from "./ensure_symlink.js";
export * from "./errors.js";
export * from "./exists.js";
export * from "./expand_glob.js";
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
export * from "./utime.js";
export * from "./walk.js";
export * from "./write_file.js";
export * from "./write_text_file.js";
