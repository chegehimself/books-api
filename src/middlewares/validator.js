import Joi from "joi";

const email = Joi.when("username", {
  is: Joi.exist(),
  then: Joi.string().email(),
  otherwise: Joi.string()
    .email()
    .required()
});
export default {
  login: {
    body: {
      credentials: {
        email,
        password: Joi.string().required()
      }
    }
  },
  signup: {
    body: {
      user: {
        email,
        username: Joi.string(),
        password: Joi.string().required()
      }
    }
  }
};
