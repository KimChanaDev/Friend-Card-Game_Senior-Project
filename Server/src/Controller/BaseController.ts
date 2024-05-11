import {ExpressRouter} from "./ExpressRouter.js";
import {NextFunction, Request, Response} from "express";

export class BaseController  extends ExpressRouter
{
    public path: string = "";
    constructor()
    {
        super();
        this.InitializeRoutes();
    }
    private InitializeRoutes(): void
    {
        this.router.get('/healthcheck', this.HealthCheck);
    }
    private HealthCheck(req: Request, res: Response, next: NextFunction): void
    {
        res.json({
            data: "I'm fine"
        });
    }
}