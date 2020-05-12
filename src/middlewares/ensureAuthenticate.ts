import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/authConfig';

interface Token {
  iat: number;
  exp: number;
  sub: string;
}
export default function (
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const header = request.headers.authorization;

  if (!header) {
    throw new Error('token is missing');
  }
  const [, token] = header.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as Token;
    request.user = {
      id: sub,
    };
    return next();
  } catch (err) {
    throw new Error('token is invalid!');
  }
}
