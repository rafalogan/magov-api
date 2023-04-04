import { resolve } from 'path';
import { randomBytes } from 'crypto';
import multer, { diskStorage, Multer } from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

import { CustomFile, IAWS } from 'src/repositories/types';

export class MulterConfig {
	private readonly dest: string;
	private readonly _upload: Multer;
	private awsCon: IAWS = {
		storage: process.env.STORAGE_TYPE || 'local',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
		region: process.env.AWS_REGION || '',
		bucket: process.env.AWS_BUCKET || '',
	};

	constructor() {
		this.dest = resolve(__dirname, '..', '..', 'tmp', 'uploads');
		this._upload = this.awsCon.storage === 's3' ? this.setS3Storage() : this.setLocalStorage();
	}

	get upload(): Multer {
		return this._upload;
	}

	setLocalStorage() {
		const storage = diskStorage({
			destination: (req, file, cb) => cb(null, this.dest),
			filename: (req, file: CustomFile, cb: any) =>
				randomBytes(16, (err, hash) => {
					if (err) return cb(err);
					file.key = `${hash.toString('hex')}-${file.originalname}`;
					cb(null, file.key);
				}),
		});

		return multer({ dest: this.dest, storage });
	}

	setS3Storage() {
		const { bucket } = this.awsCon;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const s3 = new S3Client();

		const storage = multerS3({
			s3,
			bucket,
			contentType: multerS3.AUTO_CONTENT_TYPE,
			acl: 'public-read',
			metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
			key: (req, file, cb) => randomBytes(16, (err, hash) => (err ? cb(err) : cb(null, `${hash.toString('hex')}-${file.originalname}`))),
		});

		return multer({ dest: this.dest, storage });
	}
}
