import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { ErrorMessage } from '../dto/error-message';
import type { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export const errorHandler: ErrorRequestHandler = (err: ErrorMessage, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line no-unused-vars
    logger.error(`Error: ${err.message}`);
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error',
    });
};