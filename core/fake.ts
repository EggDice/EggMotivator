import { throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

type MethodTypes = 'sync' | 'async' | 'observable';

type FakeConfigs<FAKE extends Object> = {
  [KEY in keyof Partial<FAKE>]: { type: MethodTypes, error: Error };
};

type FakeConfig = { type: MethodTypes, error: Error };

type ErroredFake<FAKE, ERROR_CONFIGS extends Record<string, FakeConfig>> = ({
  [KEY in keyof (FAKE)]:
    KEY extends keyof ERROR_CONFIGS ?
      ERROR_CONFIGS[KEY]['type'] extends 'sync' ?
        ThrowingSync :
        ERROR_CONFIGS[KEY]['type'] extends 'asnync' ?
          ThrowingAsync :
          ThrowingObservable
      :
      FAKE[KEY];
})

type ThrowingSync = (...args: any[]) => never;
type ThrowingAsync = (...args: any[]) => never;
type ThrowingObservable = (...args: any[]) => never;

export const addErrorMethodsToFake = <T>(originalFake: (...args: any[]) => T) =>
  (configs: FakeConfigs<ReturnType<typeof originalFake>>, ...restArgs: any[]):
      ErroredFake<ReturnType<typeof originalFake>, typeof configs> => {
    const fake = originalFake(...restArgs);
    const throwings = generateThrowingMethods(configs);
    return {
      ...fake,
      ...throwings,
    } as ErroredFake<T, typeof configs>;
  };

const THROWING_METOD_GENERATORS = {
  'sync': (error: Error) => () => { throw error },
  'async': (error: Error) => async () => { throw error },
  'observable': (error: Error) => () =>
    timer(1).pipe(mergeMap(() => throwError(error))),
}

const generateThrowingMethods = (configs: Record<string, FakeConfig>) =>
  Object.fromEntries(
    Object.entries(configs).map(([ method, { error, type }]) =>
      [method, THROWING_METOD_GENERATORS[type](error)]
    ),
  );
