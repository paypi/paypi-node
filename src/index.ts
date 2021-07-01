import { request, gql, GraphQLClient } from 'graphql-request';
import { GraphQLError, DomainError } from './errors';

const HOST = 'https://api.staging.paypi.dev';
const PORT = '80';
const BASE_PATH = '/graphql';

class User {
  private subscriberSecret: string;
  paypi: PayPI;
  isAuthed: boolean;
  constructor(
    paypiInstance: PayPI,
    subscriberSecret: string,
    isAuthed: boolean
  ) {
    this.subscriberSecret = subscriberSecret;
    this.paypi = paypiInstance;
    this.isAuthed = isAuthed;
  }

  async makeCharge(
    chargeIdentifier: string,
    unitsUsed: number = 1
  ): Promise<boolean> {
    if (!this.isAuthed) {
      throw new Error(
        'Cannot charge an unauthorized used. This happened because you tried to make a charge against a user that gave an invalid token or your API secret was invalid.'
      );
    }

    const makeChargeMutation = gql`
      mutation makeCharge(
        $chargeIdent: String!
        $subSecret: String!
        $unitsUsed: Int
      ) {
        makeCharge(
          input: {
            chargeIdentifier: $chargeIdent
            subscriptionSecret: $subSecret
            unitsUsed: $unitsUsed
          }
        ) {
          success
        }
      }
    `;

    const variables = {
      chargeIdent: chargeIdentifier,
      subSecret: this.subscriberSecret,
      unitsUsed: unitsUsed,
    };

    const data = await this.paypi._client.request(
      makeChargeMutation,
      variables,
      {}
    );

    if (data?.response?.errors?.length > 0) {
      throw new GraphQLError(data.response.errors[0]);
    }

    if (data?.makeCharge?.success) {
      return true;
    } else {
      throw new DomainError('PaymentError', 'Unable to charge client');
    }
  }
}

class PayPI {
  readonly _key: string;
  _client: GraphQLClient;

  constructor(key: string) {
    this._key = key;
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
