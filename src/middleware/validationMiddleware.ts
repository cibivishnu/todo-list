import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { logger } from "../config/logger";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation error: ' + req.baseUrl + JSON.stringify(errors.array()));
        res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
};