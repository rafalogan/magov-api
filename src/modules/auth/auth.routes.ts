import { Multer } from 'multer';
import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { AuthController } from './auth.controller';

export class AuthRoutes extends Routes {
	constructor(
		options: RouteOptions,
		private upload: Multer,
		private authController: AuthController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app.route('/signin').post(this.authController.signin.bind(this.authController)).all(methodNotAllowed);
		this.app.route('/signup').post(this.upload.single('file'), this.authController.signup.bind(this.authController)).all(methodNotAllowed);
		this.app.route('/validate-token').get(this.authController.validateToken.bind(this.authController)).all(methodNotAllowed);
		this.app.route('/user-verify').post(this.authController.verifyUserEmail.bind(this.authController)).all(methodNotAllowed);
		this.app.route('/recovey').post(this.authController.recoveyPassword.bind(this.authController)).all(methodNotAllowed);
	}
}
