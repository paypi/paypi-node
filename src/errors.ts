export class DomainError extends Error {
  constructor(name, message) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = name;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

type CustomGraphError = {
  message?: string;
  path: string[];
  extensions?: {
    helpText?: string;
    message: string;
    title?: string;
    type: string;
  };
};

export class GraphQLError extends DomainError {
  readonly error: CustomGraphError;
  readonly type: string;
  constructor(error: CustomGraphError) {
    if (error?.extensions?.helpText) {
      super(error.extensions.type, error?.extensions?.helpText);
    } else if (error?.extensions?.type && error?.extensions?.message) {
      super(error.extensions.type, error?.extensions?.message);
    } else {
      super('PayPI Response', error.message);
    }

    this.type = error?.extensions?.type || 'GenericError';
    this.error = error;
  }
}
