import { NextFunction, Request, Response } from 'express';

/** 미들웨어는 AppModule에 설치할 수도, UserModule에 설치할 수도 있다 */

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}
