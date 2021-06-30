import { request, gql } from 'graphql-request';

const HOST = 'localhost';
const PORT = '8080';
const BASE_PATH = '/graphql';

function PayPI(key: string): void {
  if (!(this instanceof PayPI)) {
    return new PayPI(key);
  }
}

PayPI.prototype.test = function (a: string) {
  return a;
};

export default PayPI;
