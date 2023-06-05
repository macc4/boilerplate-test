import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default('3000'),
  NODE_ENV: Joi.string().valid('dev', 'qa', 'prod').default('dev'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_ACCESS_TOKEN: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),

  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PRESIGNED_URL_EXPIRY_TIME: Joi.number().required(),
  AWS_IMAGE_BLOCK_BUCKET_NAME: Joi.string().required(),
  AWS_TEMPLATE_PREVIEW_BUCKET_NAME: Joi.string().required(),
});
