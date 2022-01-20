import { coreMarbles } from './marbles'
import { Subject } from 'rxjs'

test('it should run a single function', coreMarbles((m) => {
  const s = new Subject()
  m.coldCall('-cc', {
    c: () => s.next('c'),
  })
  m.expect(s).toBeObservable('-cc', { c: 'c' })
}))

test('it should run multiple functions', coreMarbles((m) => {
  const s = new Subject()
  m.coldCall('-cd', {
    c: () => s.next('c'),
    d: () => s.next('d'),
  })
  m.expect(s).toBeObservable('-cd', { c: 'c', d: 'd' })
}))

test('it should create a boolean marble', coreMarbles((m) => {
  m.expect(m.coldBoolean('tf')).toBeObservable('tf', { t: true, f: false })
}))
