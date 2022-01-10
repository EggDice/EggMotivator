/**
 * This is an implementation of the ES2022 feature error causes.
 * It will be maybe unnecessary, when the feature is implemented in React
 * Native
 */
export class CoreError extends Error {
  constructor(message: string, options?: Object) {
    // @ts-ignore:2554 - Errors will suport a second argument with ES2022
    super(message, options);
    // @ts-ignore:2532 - options is checked if an object, in operator is safe
    if ((isObject(options) && 'cause' in options) && !('cause' in this)) {
      // @ts-ignore:2339 - cause property is checked if exists
      const cause = options.cause;
      // @ts-ignore:2339 - cause property is created here
      this.cause = cause;
      if ('stack' in cause) {
        this.stack = this.stack + '\nCAUSE: ' + cause.stack;
      }
    }
  }
  // @ts-check
}

function isObject(value: any) {
  return value !== null && typeof value === 'object';
}
