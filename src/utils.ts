import { HttpException } from "@nestjs/common";
import { RESTError } from "./types/RESTError";

/**
 * A workaround to throw an exception in an expression.
 * JS throw keyword creates a statement not an expression.
 * This function allows throw to be used as an expression
 * @param errMessage Message present in the error message
 */
export function throwErr(errMessage: string): never {
    throw new Error(errMessage);
  }
  
  /**
   * This function allows throw to be used as an expression
   * @param errMessage Message present in the error message
   */
  export function throwHTTPErr(errorData: RESTError): never {
    const { message, statusCode } = errorData;
    throw new HttpException(message, statusCode);
  }