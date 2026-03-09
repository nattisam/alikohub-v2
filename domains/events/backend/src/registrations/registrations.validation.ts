import * as Joi from "joi";

export const CreateRegistrationSchema = Joi.object({
  dto: Joi.object({
    eventId: Joi.string().required(),
    attendeeName: Joi.string().required(),
    attendeeEmail: Joi.string().email().required(),
    ticketId: Joi.string().optional().allow(null),
    totalPaid: Joi.number().optional().default(0),
  }).required(),
  user: Joi.any().optional(), // Can be anonymous
});

export const RegistrationIdSchema = Joi.object({
  id: Joi.string().required(),
  user: Joi.any().required(),
});
