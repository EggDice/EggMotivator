import { marbles } from 'rxjs-marbles/jest'
import { TestObservableLike } from 'rxjs-marbles/types'

type Marbles = typeof marbles
type MarblesRunner = Parameters<Marbles>[0]
type MarblesParam = Parameters<MarblesRunner>[0]
type Runner = (m: MarblesExtensions) => ReturnType<MarblesRunner>
type MarbleFunctions = Record<string, () => void>

interface MarblesExtensions extends MarblesParam {
  coldCall: (marble: string, functions: MarbleFunctions) => void
  coldBoolean: (marble: string) => TestObservableLike<boolean>
};

export const coreMarbles = (runner: Runner): (() => void) => marbles((m) => {
  const coldCall = (marble: string, functions: MarbleFunctions): void => {
    const marbleDefinition = Object.fromEntries(
      Object.keys(functions).map((key) => [key, key]),
    )
    m.cold(marble, marbleDefinition)
      .subscribe((key) => functions[key]())
  }
  const coldBoolean = (marble: string): TestObservableLike<boolean> =>
    m.cold(marble, MARBLES_BOOLEAN)

  return runner(
    // The methods on `m` (the RunContext) are on the prototype, so we have to
    // use mutation
    Object.assign(
      m,
      {
        coldCall,
        coldBoolean,
      },
    ))
})

export const MARBLES_BOOLEAN = {
  t: true,
  f: false,
}
