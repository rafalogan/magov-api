import { Request, Response } from 'express';

export abstract class Controller {
	abstract save(req: Request, res: Response): void;
	abstract edit(req: Request, res: Response): void;
	abstract list(req: Request, res: Response): void;
	abstract remove(req: Request, res: Response): void;
}
