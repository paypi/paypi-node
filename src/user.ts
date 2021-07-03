import { gql } from 'graphql-request';
import { GraphQLError, DomainError } from './errors';
import PayPI from './paypi';

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

export default User;
