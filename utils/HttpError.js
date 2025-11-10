
// This class creates a constructor for custom errors messages it takes in the status code and returns a message 
// which will be defined later in auth based on the type of error.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const INTERNAL_SERVER_ERROR = 500;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const TEAPOT = 418; //classic 