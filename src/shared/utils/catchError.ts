import { Request, Response, NextFunction } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchError = (controller: Controller) => {
    return (req: Request, res: Response, next: NextFunction) => {
        controller(req, res, next).catch(next);
    };
};

export default catchError;