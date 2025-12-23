import * as Joi from 'joi';

const eventFields = {
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),
  date: Joi.string().required().messages({
    'string.empty': 'Date is required',
    'any.required': 'Date is required',
  }),
  time: Joi.string().required().messages({
    'string.empty': 'Time is required',
    'any.required': 'Time is required',
  }),
  location: Joi.string().required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required',
  }),
};

export const createEventSchema = Joi.object({
  dto: Joi.object(eventFields).required(),
  user: Joi.object().required(),
  // Some payloads might have other top-level fields
}).unknown(true);

export const updateEventSchema = Joi.object({
  id: Joi.string().optional(), // update_event payload usually has id and dto
  dto: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.string().optional(),
    time: Joi.string().optional(),
    location: Joi.string().optional(),
  }).min(1).required(),
  user: Joi.object().required(),
}).unknown(true);
