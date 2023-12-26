/**
 * This file contains the generic error class type which contains error messages that we might
 * need in development. Every time a new feature is added BE SURE TO ADD PROPER ERROR MESSAGES
 * to the corresponding error class it falls under
 *
 */

/**
 * This is the base class for all error types. All errors will be divided into
 * different groups based on error type and will have its own respective class
 * in a seperate file
 */
export class CustomError extends Error {
  public code: number;

  public status: number;

  public message: string;

  public context: string[];

  /**
   * This is the generic constructor for errors
   * @param code: This is the code that identifies each error
   * @param status: This is the error status when sending error response
   * @param message: This is the message that informs users of what went wrong
   */
  constructor(code: number, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.message = message;
    this.context = [];
  }

  /**
   * This function allows you to add context to error messages
   * such as stack traces
   * @param message Message to be added
   */
  public addContext(message: string) {
    this.context.push(message);
    return this.context;
  }

  /**
   * This method will display the error message
   * based on whether its client facing or not
   * @param clientFacing: determines whether the message is client facing
   */
  public displayMessage(clientFacing: boolean) {
    if (clientFacing) {
      return this.message;
    }

    return `Error: Type ${this.constructor.name}, Code ${this.code}, Context: ${
      this.context.length ? "\n" + this.context.join("\n\n") : null
    }`;
  }
}
