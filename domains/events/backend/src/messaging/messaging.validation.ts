import * as Joi from "joi";

export const SendMessageSchema = Joi.object({
  id: Joi.string().uuid().required(),
  dto: Joi.object({
    subject: Joi.string().required(),
    content: Joi.string().required(),
    targetAudience: Joi.string().valid("ALL", "CHECKED_IN", "NOT_CHECKED_IN", "RSVP_YES", "RSVP_MAYBE").required(),
    replyTo: Joi.string().email().optional(),
  }).required(),
  user: Joi.any().required(),
});
