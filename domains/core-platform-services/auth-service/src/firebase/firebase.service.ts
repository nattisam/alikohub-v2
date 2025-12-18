import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
	private readonly logger = new Logger(FirebaseService.name);

	onModuleInit() {
		try {
			if (!admin.apps.length) {
				const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
				if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
					throw new Error('Firebase service account file not found');
				}
				const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
				admin.initializeApp({
					credential: admin.credential.cert(serviceAccount),
				});
				this.logger.log('Firebase Admin initialized with real credentials');
			}
		} catch (error) {
			this.logger.error('Failed to initialize Firebase Admin:', error);
			throw error;
		}
	}

	getAuth() {
		return admin.auth();
	}
}
