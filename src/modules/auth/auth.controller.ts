import httpStatus, { BAD_GATEWAY, BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import {
	baseUrl,
	equalsOrError,
	existsOrError,
	isRequired,
	notExistisOrError,
	requiredFields,
	responseApi,
	responseApiError,
	ResponseException,
	setAddress,
	setReadOptions,
} from 'src/utils';
import { AuthService } from 'src/services';
import { onLog, ResponseHandle } from 'src/core/handlers';
import { Credentials, RecoveryModel, UserModel } from 'src/repositories/models';
import { CustomFile, IFile } from 'src/repositories/types';

export class AuthController {
	constructor(private authService: AuthService) {}

	signin(req: Request, res: Response) {
		try {
			this.authService.validateCredentials(req.body);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: httpStatus.BAD_REQUEST });
		}

		const credentials = new Credentials(req.body);

		this.authService
			.verifyCredentials(credentials)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err =>
				ResponseHandle.onError({
					res,
					message: 'Login unauthorized! verify your credentials.',
					err,
					status: httpStatus.UNAUTHORIZED,
				})
			);
	}

	signup(req: Request, res: Response) {
		onLog('body', setAddress(req));
		try {
			this.authService.validateSignupData(setAddress(req));
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: httpStatus.BAD_REQUEST });
		}

		const image = this.setUserImage(req);
		const rawData = setAddress(req);
		const user = new UserModel({ ...rawData, image });

		this.authService
			.signupOnApp(user)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	validateToken(req: Request, res: Response) {
		this.authService
			.tokenIsValid(req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	verifyUserEmail(req: Request, res: Response) {
		const { email, subject, message } = req.body;
		try {
			const requiredData = requiredFields([
				{ field: email, message: isRequired('E-mail') },
				{ field: subject, message: isRequired('Subject') },
				{ field: message, message: isRequired('Message') },
			]);

			notExistisOrError(requiredData, requiredData?.join('\n') as string);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: httpStatus.BAD_REQUEST });
		}

		this.authService
			.verifyEmailUser(email, { subject, message })
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	recoveyPassword(req: Request, res: Response) {
		const { email, password, confirmPassword } = req.body;

		try {
			const requireds = requiredFields([
				{ field: email, message: isRequired('E-mail') },
				{ field: password, message: isRequired('Password') },
				{ field: confirmPassword, message: isRequired('Confirm Password') },
			]);

			notExistisOrError(requireds, requireds?.join('\n') as string);
			equalsOrError(password, confirmPassword, 'Confirm Password shuld be equal to password.');
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const data = new RecoveryModel(req.body);

		this.authService
			.recoveryPassword(data)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	private setUserImage(req: Request) {
		const image = req.body.image ?? { title: req.body.imageTitle, alt: req.body.imageAlt };
		const { title, alt } = image;
		const file = req.file as CustomFile;

		return {
			title,
			alt,
			name: file.originalname,
			filename: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file.key : file.filename,
			type: file.mimetype,
			url: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file.location : `${baseUrl()}/media/${file.filename}`,
		} as IFile;
	}
}
