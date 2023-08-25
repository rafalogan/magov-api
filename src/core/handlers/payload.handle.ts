import { Request } from 'express';
import jwt from 'jwt-simple';

import { Payload } from 'src/repositories/models';
import { IUserLog } from 'src/repositories/types';

export const getPayload = (req: Request) => {
	const token = extractToken(req);

	return token ? decodeToken(token) : undefined;
};

export const extractToken = (req: Request) => {
	const { authorization } = req.headers;
	const [agent, token] = authorization ? authorization.split(' ') : [];

	return agent === 'Bearer' ? token : undefined;
};

export const decodeToken = (token: string) => {
	const raw = jwt.decode(token, process.env.AUTHSECRET as string);

	return new Payload(raw);
};

export const getUserIdByToken = (req: Request) => getPayload(req)?.id as number;

export const getTenancyByToken = (req: Request) => getPayload(req)?.tenancyId as number;

export const getIdByReq = (req: Request) => Number(req.params.id);

export const getUserLogData = (req: Request, inTable: string, inTableId: number, action: string): IUserLog => {
	const userId = getUserIdByToken(req);
	const tenancyId = getTenancyByToken(req);
	const logDate = new Date();
	return { action, inTable, inTableId, userId, tenancyId, logDate };
};
