/**
 * @fileoverview Tests for ECMA feature flags
 * @author Nicholas C. Zakas
 * @copyright jQuery Foundation and other contributors, https://jquery.org/
 * MIT License
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    shelljs = require("shelljs"),
    testUtils = require("../../tools/test-utils");

//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------

const JSX_FIXTURES_DIR = "./tests/fixtures/jsx";

const filesWithOutsandingTSIssues = [
    "jsx/embedded-tags", // https://github.com/Microsoft/TypeScript/issues/7410
    "jsx/namespaced-attribute-and-value-inserted", // https://github.com/Microsoft/TypeScript/issues/7411
    "jsx/namespaced-name-and-attribute", // https://github.com/Microsoft/TypeScript/issues/7411
    "jsx/invalid-namespace-value-with-dots" // https://github.com/Microsoft/TypeScript/issues/7411
];

const jsxTestFiles = shelljs.find(JSX_FIXTURES_DIR)
    .filter(filename => filename.indexOf(".src.js") > -1)
    .filter(filename => filesWithOutsandingTSIssues.every(fileName => filename.indexOf(fileName) === -1))
    // strip off ".src.js"
    .map(filename => filename.substring(JSX_FIXTURES_DIR.length - 1, filename.length - 7));

const JSX_JSXTEXT_FIXTURES_DIR = "./tests/fixtures/jsx-useJSXTextNode";

const jsxTextTestFiles = shelljs.find(JSX_JSXTEXT_FIXTURES_DIR)
    .filter(filename => filename.indexOf(".src.js") > -1)
    // strip off ".src.js"
    .map(filename => filename.substring(JSX_JSXTEXT_FIXTURES_DIR.length - 1, filename.length - 7));

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("JSX", () => {

    /**
     * Test each fixture file
     * @param {string} fixturesDir Fixtures Directory
     * @param {boolean} useJSXTextNode Use JSX Text Node
     * @returns {void}
     */
    function testFixture(fixturesDir, useJSXTextNode) {

        return filename => {
            // Uncomment and fill in filename to focus on a single file
            // var filename = "jsx/invalid-matching-placeholder-in-closing-tag";
            const code = shelljs.cat(`${path.resolve(fixturesDir, filename)}.src.js`);

            const config = {
                loc: true,
                range: true,
                tokens: true,
                errorOnUnknownASTType: true,
                useJSXTextNode,
                ecmaFeatures: {
                    jsx: true
                }
            };

            test(`${path.resolve(fixturesDir, filename)}.src`, testUtils.createSnapshotTestBlock(code, config));
        };
    }

    describe("useJSXTextNode: false", () => {
        jsxTestFiles.forEach(testFixture(JSX_FIXTURES_DIR, false));
    });
    describe("useJSXTextNode: true", () => {
        jsxTextTestFiles.forEach(testFixture(JSX_JSXTEXT_FIXTURES_DIR, true));
    });
});
