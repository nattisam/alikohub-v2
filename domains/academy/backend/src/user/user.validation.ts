import * as Joi from 'joi';
import { AcademyRole } from '../generated/client';

export const UserProfileSchema = Joi.object({
  user: Joi.any().required().description('The authenticated user to fetch the profile for')
}).description('Schema for fetching a user academy profile');

export const SelectRoleSchema = Joi.object({
  user: Joi.any().optional().description('The authenticated user context'),
  userId: Joi.string().required().description('The unique identifier of the user to update'),
  role: Joi.string().valid(...Object.values(AcademyRole)).required().description('The role to assign to the user within the academy')
}).description('Schema for selecting or updating a user academy role');

export const UserCreatedEventSchema = Joi.object({
  userId: Joi.string().required().description('The unique identifier (Firebase ID) of the newly created user'),
  email: Joi.string().email().required().description('The email address of the new user'),
  role: Joi.string().required().description('The initial role for the user')
}).description('Schema for internal user creation events');
