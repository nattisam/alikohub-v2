import * as Joi from 'joi';

export const CreateExerciseSchema = Joi.object({
  dto: Joi.object({
    title: Joi.string().required().description('The title of the exercise'),
    description: Joi.string().required().description('Detailed instructions for the exercise'),
    moduleId: Joi.number().integer().required().description('The module ID this exercise belongs to'),
    type: Joi.string().valid('QUIZ', 'ASSIGNMENT', 'PROJECT').required().description('The pedagogical type of exercise'),
    maxScore: Joi.number().integer().optional().description('Maximum possible points for this exercise'),
    settings: Joi.object().optional().description('Custom configuration (e.g., time limits, pass marks)')
  }).required().description('Exercise creation details'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for creating a new exercise');

export const UpdateExerciseSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the exercise to update'),
  dto: Joi.object({
    title: Joi.string().optional().description('The updated title'),
    description: Joi.string().optional().description('The updated instructions'),
    moduleId: Joi.number().integer().optional().description('The updated module ID'),
    type: Joi.string().valid('QUIZ', 'ASSIGNMENT', 'PROJECT').optional().description('The updated type'),
    maxScore: Joi.number().integer().optional().description('The updated max score'),
    settings: Joi.object().optional().description('The updated settings')
  }).required().description('Exercise update details'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for updating an existing exercise');

export const ExerciseIdSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the exercise'),
  user: Joi.any().required().description('The authenticated user')
}).description('Schema for operations requiring a single exercise ID');

export const ModuleIdExerciseSchema = Joi.object({
  moduleId: Joi.number().integer().required().description('The unique identifier of the module'),
  user: Joi.any().required().description('The authenticated user'),
  query: Joi.object().optional().default({}).description('Pagination and filter queries')
}).description('Schema for fetching exercises by module');

export const FindExercisesSchema = Joi.object({
  user: Joi.any().required().description('The authenticated user'),
  query: Joi.object().optional().default({}).description('Pagination and filter queries')
}).description('Schema for querying lists of exercises');

export const SubmitExerciseSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the exercise being submitted'),
  dto: Joi.object({
    answer: Joi.any().required().description('The student response (structured based on exercise type)'),
    submissionTime: Joi.date().optional().description('Optional timestamp of the submission')
  }).required().description('Submission payload'),
  user: Joi.any().required().description('The student performing the submission')
}).description('Schema for submitting an exercise');

export const GradeExerciseSchema = Joi.object({
  id: Joi.number().integer().required().description('The unique identifier of the submission being graded'),
  dto: Joi.object({
    isCorrect: Joi.boolean().required().description('Whether the submission is correct'),
    score: Joi.number().required().description('The numerical grade assigned'),
    feedback: Joi.string().optional().allow('', null).description('Qualitative feedback from the instructor'),
  }).required().description('Grading details'),
  user: Joi.any().required().description('The instructor performing the grading')
}).description('Schema for grading a student submission');
