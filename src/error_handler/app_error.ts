
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Global Error Handler:', err);

  let statusCode = 500; 

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
  }

  if ((err as any).statusCode) {
    statusCode = (err as any).statusCode;
  }

  res.status(statusCode).json({ error: err.message });
}

export class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};