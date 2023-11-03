import { BAD_REQUEST, UNAUTHORIZED } from 'http-status';
import { Request, Response } from 'express';

import { equalsOrError, isRequired, notExistisOrError, requiredFields, setAddress, setPlansToUser, setUserImage } from 'src/utils';
import { AuthService } from 'src/services';
import { onLog, ResponseHandle } from 'src/core/handlers';
import { Credentials, RecoveryModel, UserModel } from 'src/repositories/models';

export class AuthController {
	constructor(private authService: AuthService) {}

	signin(req: Request, res: Response) {
		try {
			this.authService.validateCredentials(req.body);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const credentials = new Credentials(req.body);

		this.authService
			.verifyCredentials(credentials)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err =>
				ResponseHandle.onError({
					res,
					message: 'Login unauthorized! verify your credentials.',
					err,
					status: UNAUTHORIZED,
				})
			);
	}

	signup(req: Request, res: Response) {
		const address = setAddress(req);
		const plans = setPlansToUser(req);

		try {
			this.authService.validateSignupData({ ...req.body, address, plans });
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const image = this.setUserImage(req);
		const tenancyId = undefined;
		const unit = req.body.unit ? { ...req.body.unit, tenancyId } : undefined;
		const user = new UserModel({ ...req.body, address, image, plans, newTenancy: true, unit, tenancyId });
		onLog('User to signup', user);

		this.authService
			.signupOnApp(user, req)
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
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
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
			.recoveryPassword(data, req)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data?.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	private setUserImage = (req: Request) => setUserImage(req);
}
