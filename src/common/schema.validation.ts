/* eslint-disable prettier/prettier */
import Joi from "joi";

export const ConfigValidation = Joi.object({
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DATABASE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    EXPIRES_IN: Joi.number().required()
})