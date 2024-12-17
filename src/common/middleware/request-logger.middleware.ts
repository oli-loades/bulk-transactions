import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  Logger.log(`${req.method} ${res.statusCode} ${req.url}`);
  next();
}
