import { application } from './application';

import type { FunctionComponent } from 'react';

test('Returns the Root component', () => {
  const Root = () => (<div></div>);
  const App = application({
    run: () => Root,
  });
  expect(App).toBe(Root);
});

test('Returns the Root component', () => {
  const returnValue = application({});
  expect(returnValue).toBe(0);
});

test('Read external services', () => {
  const myService = 'my-service';
  type Services = { myService: 'my-service' };
  const returnValue = application<Services, Services>({
    externalServices: { myService },
    run: ({ myService }) => {
      return myService;
    },
  });
  expect(returnValue).toBe('my-service')
});

test('Configure services', () => {
    const myExternalService = 'my-service';
    type ExternalServices = { myExternalService: 'my-service' };
    type InternalServices = { myService: 'my-service' };
    const returnValue = application<ExternalServices, InternalServices>({
    externalServices: { myExternalService },
    configure: ({ myExternalService }) => ({ myService: myExternalService }),
    run: ({ myService }) => {
      return myService;
    },
  });
  expect(returnValue).toBe('my-service')
});
