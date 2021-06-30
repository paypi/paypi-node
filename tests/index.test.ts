import PayPI from '../src/index';
import { GraphQLClient } from 'graphql-request';

function generateMockClient(response: any) {
  class GQLClient extends GraphQLClient {
    request<V = any>(query: any, vars: V, headers: any): Promise<any> {
      return new Promise<any>((res, rej) => {
        res(response);
      });
    }
  }

  return new GQLClient('123');
}

test('checks authed auth response', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    response: {
      data: {
        checkSubscriberSecret: {
          isAuthed: true,
        },
      },
    },
    variables: {},
  });
  const k = await s.authenticate('1234');
  expect(k.isAuthed).toBe(true);
});

test('checks unauthed auth response', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    response: {
      data: {
        checkSubscriberSecret: {
          isAuthed: false,
        },
      },
    },
    variables: {},
  });
  const k = await s.authenticate('1234');
  expect(k.isAuthed).toBe(false);
});
