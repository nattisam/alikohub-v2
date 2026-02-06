import * as Joi from 'joi';
import { ContentType } from '@prisma/client';

export const CreateContentSchema = Joi.object({
  dto: Joi.object({
    title: Joi.string().required().description('The title of the content item'),
    type: Joi.string().valid(...Object.values(ContentType)).required().description('The type of content (e.g., VIDEO, PDF, QUIZ)'),
    url: Joi.string().allow('', null).optional().description('Link to the content (for external videos or files)'),
    body: Joi.string().allow('', null).optional().description('The text body/content for articles or descriptions'),
    lessonId: Joi.number().integer().required().description('The ID of the lesson this content belongs to')
  }).required().description('Content creation details'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for creating new educational content');

export const UpdateContentSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the content item to update'),
  dto: Joi.object({
    title: Joi.string().optional().description('The updated title'),
    type: Joi.string().valid(...Object.values(ContentType)).optional().description('The updated type'),
    url: Joi.string().allow('', null).optional().description('The updated URL'),
    body: Joi.string().allow('', null).optional().description('The updated body text'),
    lessonId: Joi.number().integer().optional().description('The updated lesson ID')
  }).required().description('Content update details'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for updating an existing content item');

export const ContentIdSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the content'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for operations requiring a single content ID');

export const LessonIdContentSchema = Joi.object({
  lessonId: Joi.number().integer().required().description('The unique identifier of the lesson'),
  user: Joi.any().required().description('The authenticated user'),
  query: Joi.object().optional().default({}).description('Pagination and filter queries')
}).description('Schema for fetching content by lesson');

export const FindContentQuerySchema = Joi.object({
  user: Joi.any().required().description('The authenticated user'),
  query: Joi.object().optional().default({}).description('Pagination and filter queries')
}).description('Schema for querying content lists');

export const CourseIdContentSchema = Joi.object({
  courseId: Joi.number().integer().required().description('The unique identifier of the course'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for fetching content by course');

export const UploadContentSchema = Joi.object({
  dto: Joi.object({
    lessonId: Joi.number().integer().required().description('The ID of the lesson to associate the upload with'),
    contentType: Joi.string().valid(...Object.values(ContentType)).required().description('The type of content being uploaded'),
    title: Joi.string().required().description('The display title for the uploaded file')
  }).required().description('Metadata for the file upload'),
  file: Joi.object({
    buffer: Joi.any().required().description('Binary data of the file'),
    originalname: Joi.string().required().description('The original filename'),
    mimetype: Joi.string().required().description('The MIME type of the file'),
    size: Joi.number().required().description('The size of the file in bytes')
  }).required().description('The uploaded file object'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for uploading content files');

export const SearchContentSchema = Joi.object({
  query: Joi.string().required().description('The search term or keyword'),
  type: Joi.string().valid(...Object.values(ContentType)).optional().description('Optional filter by content type'),
  courseId: Joi.number().integer().optional().description('Optional filter by course ID'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for searching across content items');
