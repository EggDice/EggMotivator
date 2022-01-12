import { of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { addErrorMethodsToFake } from './fake';

test('Create the original if args are empty', () => {
  const originalFake = () => ({ method: () => 1 });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const fake = fakeCreator({});
  expect(fake.method).not.toThrow();
});

test('Create sync throwing function', () => {
  const originalFake = () => ({ method: () => 1 });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const error = new Error('test error');
  const fake = fakeCreator({ method: { type: 'sync', error } });
  expect(fake.method).toThrow(error);
});

test('Create multiple sync throwing function', () => {
  const originalFake = () => ({ method: () => 1, method2: () => 2 });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const error = new Error('test error');
  const error2 = new Error('test error2');
  const fake = fakeCreator({
    method: { type: 'sync', error: error },
    method2: { type: 'sync', error: error2 },
  });
  expect(fake.method).toThrow(error);
  expect(fake.method2).toThrow(error2);
});

test('Create async throwing function', async () => {
  const originalFake = () => ({ method: async () => 1 });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const error = new Error('test error');
  const fake = fakeCreator({ method: { type: 'async', error } });
  await expect(fake.method).rejects.toEqual(error);
});

test('Create observable throwing function', marbles((m) => {
  const originalFake = () => ({ method: () => of(1) });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const error = new Error('test error');
  const fake = fakeCreator({ method: { type: 'observable', error } });
  m.expect(fake.method()).toBeObservable('-#', {}, error);
}));

test('Forwarding constructor paramters', () => {
  const originalFake = (num1: number, num2: number) => ({
    method: () => num1,
    method2: () => num2,
  });
  const fakeCreator = addErrorMethodsToFake(originalFake);
  const fake = fakeCreator({}, 1, 2);
  expect(fake.method() + fake.method2()).toBe(3);
});
