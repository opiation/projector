import { Result } from "./result.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe(Result.name, () => {
  describe(".firstOk", () => {
    it("returns the first Ok result from the given Iterable results", () => {
      /** @type {Iterable<Result<number, string>>} */
      const results = [
        Result.err("error 1"),
        Result.ok(42),
        Result.err("error 2"),
      ];

      const result = Result.firstOk(results);

      assert.deepStrictEqual(result, 42);
    });

    it("returns undefined if no result in the given Iterable is Ok", () => {
      const results = [
        Result.err("error 1"),
        Result.err("error 2"),
      ];

      const result = Result.firstOk(results);

      assert.deepStrictEqual(result, undefined);
    });
  });

  describe(".fromJSON", () => {
    it("creates a Result from a JSON object", () => {
      /** @type {import("./result.js").Ok<number>}  */
      const state = { ok: true, value: 42 };

      const result = Result.fromJSON(state);

      assert.deepStrictEqual(result, Result.ok(42));
    });
  });

  describe(".ok", () => {
    it("creates an Ok Result", () => {
      const result = Result.ok(42);

      assert.deepStrictEqual(result, Result.ok(42));
    });
  });

  describe(".okays", () => {
    it("returns an Iterable of the Ok values from the given Iterable results", () => {
      /** @type {Iterable<Result<number, string>>} */
      const results = [
        Result.err("error 1"),
        Result.ok(42),
        Result.err("error 2"),
        Result.ok(84),
      ];

      const okays = Result.okays(results);

      assert.deepStrictEqual([...okays], [42, 84]);
    });
  });

  describe("#chain", () => {
    it("applies a function to the value of an Ok Result", () => {
      const result = Result.ok(42).chain((value) => Result.ok(value * 2));

      assert.deepStrictEqual(result, Result.ok(84));
    });

    it("returns the Err Result unchanged", () => {
      const result = Result.err("error").chain(() => Result.ok(42));

      assert.deepStrictEqual(result, Result.err("error"));
    });
  });

  describe("#expect", () => {
    it("returns the value of an Ok Result", () => {
      const value = Result.ok(42).expect();

      assert.deepStrictEqual(value, 42);
    });

    it("throws the error of an Err Result", () => {
      assert.throws(() => {
        Result.err("I AM ERROR").expect();
      }, /I AM ERROR/);
    });

    it("throws the returned value of orElse if given the contained Err Result", () => {
      assert.throws(() => {
        Result.err("error").expect((msg) => `should throw an ${msg}`);
      }, /should throw an error/);
    });
  });

  describe("#map", () => {
    it("applies a function to the value of an Ok Result", () => {
      const result = Result.ok(42).map((value) => value * 2);

      assert.deepStrictEqual(result, Result.ok(84));
    });

    it("returns the Err Result unchanged", () => {
      const result = Result.err("error").map(() => 42);

      assert.deepStrictEqual(result, Result.err("error"));
    });
  });

  describe("#orElse", () => {
    it("returns the value of an Ok Result", () => {
      /** @type {Result<number, Error>} */
      const result = Result.ok(42);

      const value = result.orElse(() => 0);

      assert.deepStrictEqual(value, 42);
    });

    it("returns the returned value of onErr if given the contained Err Result", () => {
      /** @type {Result<number, string>} */
      const result = Result.err("I AM ERROR");

      const value = result.orElse(() => 42);

      assert.deepStrictEqual(value, 42);
    });
  });
});
