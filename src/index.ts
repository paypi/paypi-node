import { request, gql, GraphQLClient } from 'graphql-request';
const HOST = 'http://localhost';
const PORT = '8080';
const BASE_PATH = '/graphql';

class User {
  private subscriberSecret: string;
  isAuthed: boolean;
  constructor(subscriberSecret: string, isAuthed: boolean) {
    this.subscriberSecret = subscriberSecret;
    this.isAuthed = isAuthed;
  }
}
class PayPI {
  readonly KEY: string;
  _client: GraphQLClient;

  constructor(key: string) {
    this.KEY = key;
    this._client = new GraphQLClient(`${HOST}:${PORT}${BASE_PATH}`, {});
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
      serviceSecret: this.KEY,
      subSecret: subscriberSecret,
    };
    const data = await this._client.request(authMutation, variables, {});
    if (data?.response?.errors?.length > 0) {
      throw new Error(data.response.errors[0]?.message);
    }

    return new User(
      subscriberSecret,
      data?.response?.data?.checkSubscriberSecret?.isAuthed ?? false
    );
  }

  makeCharge(chargeIdentifier: string, unitsUsed?: number) {}
}

export default PayPI;
