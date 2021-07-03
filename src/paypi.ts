import { gql, GraphQLClient } from 'graphql-request';
import { GraphQLError } from './errors';
import User from './user';

const DEFAULT_HOST = 'https://api.paypi.dev';
const DEFAULT_PORT = '80';
const DEFAULT_BASE_PATH = '/graphql';

type Config = {
  host?: string;
  port?: string;
  basePath?: string;
};

class PayPI {
  readonly _key: string;
  _client: GraphQLClient;
  _connectionString: string;
  constructor(
    key: string,
    {
      host = DEFAULT_HOST,
      port = DEFAULT_PORT,
      basePath = DEFAULT_BASE_PATH,
    }: Config = {
      host: DEFAULT_HOST,
      port: DEFAULT_PORT,
      basePath: DEFAULT_BASE_PATH,
    }
  ) {
    this._key = key;
    this._connectionString = `${host}:${port}${basePath}`;
    this._client = new GraphQLClient(this._connectionString, {});
  }

  async authenticate(subscriberSecret: string): Promise<User> {
    const authMutation = gql`
      mutation AuthenticateClient(
        $serviceSecret: String!
        $subSecret: String!
      ) {
        checkSubscriberSecret(
          input: {
            serviceSecret: $serviceSecret
            subscriptionSecret: $subSecret
          }
        ) {
          isAuthed
        }
      }
    `;

    const variables = {
      serviceSecret: this._key,
      subSecret: subscriberSecret,
    };
    const data = await this._client.request(authMutation, variables, {});
    if (data?.response?.errors?.length > 0) {
      throw new GraphQLError(data.response.errors[0]);
    }

    return new User(
      this,
      subscriberSecret,
      data?.checkSubscriberSecret?.isAuthed ?? false
    );
  }
}

export default PayPI;
