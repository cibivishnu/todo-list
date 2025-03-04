import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { ErrorMessage } from '../dto/error-message';

export const errorHandler = (err: ErrorMessage, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`);
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error',
    });
};