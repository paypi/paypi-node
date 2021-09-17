import PayPI from '../src/index';
import { GraphQLError } from '../src/errors';
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

async function fetchUser(isAuthed: boolean = true) {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    checkSubscriberSecret: {
      isAuthed: isAuthed,
    },
    variables: {},
  });

  return await s.authenticate('1234');
}

test('with authed auth response', async () => {
  const k = await fetchUser(true);
  expect(k.isAuthed).toBe(true);
});

test('with unauthed auth response', async () => {
  const k = await fetchUser(false);
  expect(k.isAuthed).toBe(false);
});

test('with error auth response', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    response: {
      data: {
        checkSubscriberSecret: null,
      },
      errors: [
        {
          message:
            'ErrUnauthorized: User does not have authorization for this action',
          path: ['checkSubscriberSecret'],
          extensions: {
            helpText: 'User not allowed to perform this action',
            message: 'User does not have authorization for this action',
            title: 'User not authorized',
            type: 'ErrUnauthorized',
          },
        },
      ],
    },
    variables: {},
  });
  await expect(s.authenticate('1234')).rejects.toThrow(GraphQLError);

  try {
    await s.authenticate('1234');
  } catch (err) {
    expect(err.message).toBe('User not allowed to perform this action');
    expect(err.type).toBe('ErrUnauthorized');
  }
});

test('with simple error auth response', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    response: {
      data: {
        checkSubscriberSecret: null,
      },
      errors: [
        {
          message:
            'ErrUnauthorized: User does not have authorization for this action',
          path: ['checkSubscriberSecret'],
          extensions: {
            message: 'User does not have authorization for this action',
            type: 'ErrUnauthorized',
          },
        },
      ],
    },
    variables: {},
  });
  await expect(s.authenticate('1234')).rejects.toThrow(GraphQLError);

  try {
    await s.authenticate('1234');
  } catch (err) {
    expect(err.message).toBe(
      'User does not have authorization for this action'
    );
    expect(err.type).toBe('ErrUnauthorized');
  }
});

test('with no extension error response', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    response: {
      data: {
        checkSubscriberSecret: null,
      },
      errors: [
        {
          message:
            'ErrUnauthorized: User does not have authorization for this action',
          path: ['checkSubscriberSecret'],
        },
      ],
    },
    variables: {},
  });
  await expect(s.authenticate('1234')).rejects.toThrow(GraphQLError);

  try {
    await s.authenticate('1234');
  } catch (err) {
    expect(err.message).toBe(
      'ErrUnauthorized: User does not have authorization for this action'
    );
  }
});

it('should return true on success', async () => {
  let user = await fetchUser(true);

  user.paypi._client = generateMockClient({
    makeCharge: {
      success: true,
    },
    variables: {},
  });

  await expect(user.makeCharge('1234')).resolves.toBe(true);
});

it('should throw on non-success response', async () => {
  let user = await fetchUser(true);

  user.paypi._client = generateMockClient({
    makeCharge: {
      success: false,
    },
    variables: {},
  });

  try {
    await user.makeCharge('1234');
  } catch (err) {
    expect(err.name).toBe('PaymentError');
  }
});

it('should throw on server error', async () => {
  let user = await fetchUser(true);

  user.paypi._client = generateMockClient({
    response: {
      data: {
        makeCharge: null,
      },
      errors: [
        {
          message:
            'ErrUnauthorized: User does not have authorization for this action',
          path: ['checkSubscriberSecret'],
          extensions: {
            helpText: 'User not allowed to perform this action',
            message: 'User does not have authorization for this action',
            title: 'User not authorized',
            type: 'ErrUnauthorized',
          },
        },
      ],
    },
    variables: {},
  });

  try {
    await user.makeCharge('1234');
  } catch (err) {
    expect(err.message).toBe('User not allowed to perform this action');
    expect(err.type).toBe('ErrUnauthorized');
  }
});

it('should throw on blank subscriber secret given', async () => {
  let s = new PayPI('123123');
  s._client = generateMockClient({
    checkSubscriberSecret: {
      isAuthed: false,
    },
    variables: {},
  });

  try {
    await s.authenticate('');
  } catch (err) {
    expect(err.message).toBe(
      'Subscription secret not given, please provide a subscription secret.'
    );
  }
});

it('should throw on blank API secret', async () => {
  try {
    let s = new PayPI('a');
  } catch (err) {
    expect(err.message).toBe(
      'API secret not given, please set your API secret and try again.'
    );
  }
});

it('accepts given host configs', async () => {
  const host = 'https://newhost.com';
  const port = '123';
  const basePath = '/test';
  let s = new PayPI('123123', { host: host, port: port, basePath: basePath });
  expect(s._connectionString).toBe(`${host}:${port}${basePath}`);
});
