import { HttpException, HttpStatus } from "@nestjs/common";
import { RESTError } from "./types/RESTError";
import { ApiResponseOptions } from '@nestjs/swagger';

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






export const SUCCESS_RESPONSE: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Request was successful.',
  schema: {
    example: {
      success: true,
      message: 'Operation completed successfully',
      data: {},
    },
  },
};

export const CREATED_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'Resource was successfully created.',
  schema: {
    example: {
      success: true,
      message: 'Task created successfully',
      data: {},
    },
  },
};

export const BAD_REQUEST_RESPONSE: ApiResponseOptions = {
  status: 400,
  description: 'Invalid input data or missing required fields.',
  schema: {
    example: {
      success: false,
      message: 'Bad request',
      errors: [],
    },
  },
};

export const NOT_FOUND_RESPONSE: ApiResponseOptions = {
  status: 404,
  description: 'The requested resource was not found.',
  schema: {
    example: {
      success: false,
      message: 'Resource not found',
    },
  },
};

export const INTERNAL_SERVER_ERROR_RESPONSE: ApiResponseOptions = {
  status: 500,
  description: 'Internal server error occurred.',
  schema: {
    example: {
      success: false,
      message: 'Something went wrong on the server',
    },
  },
};