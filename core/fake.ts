import { throwError, timer } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import type { Observable } from 'rxjs'

type MethodTypes = 'sync' | 'async' | 'observable'

export type FakeConfigs<FAKE extends Object> = {
  [KEY in keyof(Partial<FAKE>)]: FakeConfig
}

interface FakeConfig { type: MethodTypes, error: Error }

type FakeWithThrowingMethods
  <FAKE extends Object, FAKE_CONFIGS extends FakeConfigs<FAKE>> = ({
    [KEY in keyof(FAKE)]:
    KEY extends keyof FAKE_CONFIGS ?
      FAKE[KEY] extends (...args: any[]) => Observable<any> ?
        ThrowingObservable :
        FAKE[KEY] extends (...args: any[]) => Promise<any> ?
          ThrowingAsync :
          FAKE[KEY] extends (...args: any[]) => any ?
            ThrowingSync :
            FAKE[KEY]
      :
      FAKE[KEY];
  })

type ThrowingMethods<FAKE extends Object> = {
  [KEY in keyof(FakeConfigs<FAKE>)]:
  FAKE[KEY] extends (...args: any[]) => Observable<any> ?
    ThrowingObservable :
    FAKE[KEY] extends (...args: any[]) => Promise<any> ?
      ThrowingAsync :
      FAKE[KEY] extends (...args: any[]) => any ?
        ThrowingSync :
        FAKE[KEY]
}

type ThrowingSync = (...args: any[]) => never
type ThrowingAsync = (...args: any[]) => Promise<never>
type ThrowingObservable = (...args: any[]) => Observable<never>

export const addErrorMethodsToFake = <T>(originalFake: (...args: any[]) => T) =>
  (configs: FakeConfigs<T>, ...restArgs: any[]):
  FakeWithThrowingMethods<T, typeof configs> => {
    const fake = originalFake(...restArgs)
    const throwingMethods = generateThrowingMethods<T>(configs)
    // It is a valid cast to more specific tpye
    // eslint-disable-next-line
    return {
      ...fake,
      ...throwingMethods,
    } as FakeWithThrowingMethods<T, typeof configs>
  }

const THROWING_METOD_GENERATORS = {
  sync: (error: Error) => () => { throw error },
  async: (error: Error) => async () => { throw error },
  observable: (error: Error) => () =>
    timer(1).pipe(mergeMap(() => throwError(error))),
}

const generateThrowingMethods =
  <FAKE>(configs: FakeConfigs<FAKE>): ThrowingMethods<FAKE> => {
    const entries: Array<[string, FakeConfig]> = Object.entries(configs)
    const throwingMethods = entries.map(([method, { error, type }]) =>
      [method, THROWING_METOD_GENERATORS[type](error)],
    )
    return Object.fromEntries(throwingMethods)
  }
