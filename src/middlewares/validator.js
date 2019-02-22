import Joi from "joi";

export default {
  login: {
    body: {
      credentials: {
        email: Joi.when("username", {
          is: Joi.exist(),
          then: Joi.string().email(),
          otherwise: Joi.string()
            .email()
            .required()
        }),
        password: Joi.string().required()
      }
    }
  },
  signup: {
    body: {
      user: {
        email: Joi.when("username", {
          is: Joi.exist(),
          then: Joi.string().email(),
          otherwise: Joi.string()
            .email()
            .required()
        }),
        username: Joi.string(),
        password: Joi.string().required()
      }
    }
  }
};
