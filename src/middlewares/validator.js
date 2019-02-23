import Joi from "joi";

const email = Joi.when("username", {
  is: Joi.exist(),
  then: Joi.string().email(),
  otherwise: Joi.string()
    .email()
    .required()
});

const password = Joi.string().required();

export default {
  login: {
    body: {
      credentials: {
        email,
        password
      }
    }
  },
  signup: {
    body: {
      user: {
        email,
        username: Joi.string(),
        password
      }
    }
  }
};
