import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('FileUploadService', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // Add file transport if needed for production
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
