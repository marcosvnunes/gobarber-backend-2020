import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';

interface Token {
  iat: number;
  exp: number;
  sub: string;
}
export default function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('token is missing', 401);
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as Token;
    request.user = {
      id: sub,
    };
    return next();
  } catch (err) {
    throw new AppError('token is invalid!');
  }
}
