// @ts-check

/**
 * This module exists soley for the convenience of having a `Result` class that
 * can encapsulate a success or error state within a single type. This serves
 * as a means of including error outcomes in the type information of a system
 * where throwing exceptions normally erases that type information.
 *
 * Secondly, throwing exceptions immediately unwinds the call stack which
 * interrupts the flow of code. While useful for assertions, this forces
 * callers to "catch" thrown exceptions to have fine control over the error.
 * This is achievable with `Result` as well (e.g.: using `#expect()`) but
 * handling the error path can also be deferred until later using `#chain(f)`
 * or `#map(f)`.
 *
 * @template A - The type of the value in the {@link Ok} state
 * @template E - The type of the error in the `Err` state
 * @note The implementation of this class is based on the Rust `Result` type
 *   given the convenience of its API and adoption. This could easily be
 *   implemented with factory functions and an interface instead or as pure
 *   curried functions.
 */
class Result {
  /**
   * Tag a value as an {@link Err} result.
   *
   * @template E - The type of the given error
   * @template [A=any] - The type of the value this result could have returned
   * @param {E} error
   * @returns {Result<A, E>}
   */
  static err(error) {
    return new Result({ ok: false, error });
  }

  /**
   * Returns the first `Ok` result from the given iterable
   *
   * @template A
   * @template E
   * @param {Iterable<Result<A, E>>} results
   * @returns {A | undefined}
   */
  static firstOk(results) {
    for (const result of results) {
      if (result.#state.ok) {
        return result.#state.value;
      }
    }
  }

  /**
   * Parse a result from a JSON object of either an {@link Ok} or {@link Err}
   * state. This effectively _lifts_ the given serialized result state into an
   * instance of the {@link Result} class so you can use its convenience
   * methods (e.g.: `#chain(f)`, `#expect(...)`, `#map(f)`, `#orElse(onErr)`)
   *
   * @template A
   * @template E
   * @param {Ok<A> | Err<E>} state
   * @returns {Result<A, E>}
   */
  static fromJSON(state) {
    return new Result(state);
  }

  /**
   * Tag a value as an {@link Ok} result.
   *
   * @template A - The type of the given ok value
   * @template [E=any] - The type of the error this result could have returned
   * @param {A} value
   * @returns {Result<A, any>}
   */
  static ok(value) {
    return new Result({ ok: true, value });
  }

  /**
   * @template A
   * @template E
   * @param {Iterable<Result<A, E>>} results
   * @returns {Iterable<A>}
   */
  static okays(results) {
    function* resultIterator() {
      for (const result of results) {
        if (result.#state.ok) {
          yield result.#state.value;
        }
      }
    }

    return resultIterator();
  }

  /** @type {Ok<A> | Err<E>} */
  #state;

  /**
   * @private because the `Result` constructor should not be used manually
   * despite being fully ready to do so. The `Result.err()` and `Result.ok()`
   * factory functions should be used instead to instantiate one of its variants.
   *
   * @param {Ok<A> | Err<E>} state
   */
  constructor(state) {
    this.#state = state;
  }

  /**
   * If the result is {@link Ok}, apply the given function to its value and
   * _collapse_ its returned result with this one. If the result is an
   * {@link Err}, return this result unchanged.
   *
   * @template B
   * @param {(value: A) => Result<B, E>} f
   * @returns {Result<B, E>}
   */
  chain(f) {
    if (this.#state.ok) {
      return f(this.#state.value);
    } else {
      return /** @type {Result<any, E>} */ (this);
    }
  }

  /**
   * If the result is {@link Ok}, return its value. If the result is an
   * {@link Err}, throw its contained error. If an `orElse` function is given,
   * it will be called with the contained error and its return value will be
   * thrown instead.
   *
   * @template [Exception=E]
   * @param {(error: E) => Exception} [orElse]
   * @returns {A}
   * @throws {E | Exception}
   */
  expect(orElse) {
    if (this.#state.ok) {
      return this.#state.value;
    } else {
      throw orElse ? orElse(this.#state.error) : this.#state.error;
    }
  }

  /**
   * If the result is {@link Ok}, apply the given function `f` to its value and
   * return a new {@link Ok} result with the value returned by `f`. If the
   * result is an {@link Err}, return this result unchanged.
   *
   * @template B
   * @param {(value: A) => B} f
   * @returns {Result<B, E>}
   */
  map(f) {
    if (this.#state.ok) {
      return Result.ok(f(this.#state.value));
    } else {
      return /** @type {Result<any, E>} */ (this);
    }
  }

  /**
   * If the result is {@link Ok}, return its value. If the result is an
   * {@link Err}, apply the given function to its error and return whatever
   * `onErr` returns.
   *
   * This requires the `onErr` returns a value of the same type as the
   * {@link Ok} state of the result. Thus, it's generally useful to provide a
   * _fallback_ {@link Ok} value in case of an error.
   *
   * @param {(error: E) => A} onErr
   * @returns {A}
   */
  orElse(onErr) {
    if (this.#state.ok) {
      return this.#state.value;
    } else {
      return onErr(this.#state.error);
    }
  }

  /**
   * @returns {Ok<A> | Err<E>}
   */
  toJSON() {
    return this.#state;
  }
}

/**
 * @template A
 * @typedef Ok
 * @property {true} ok
 * @property {A} value
 */

/**
 * @template E
 * @typedef Err
 * @property {false} ok
 * @property {E} error
 */

export { Result };
