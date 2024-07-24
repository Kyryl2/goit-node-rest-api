import Joi from "joi";

export const validateContactCreation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      status: "Validation Error",
      message: error.details[0].message,
    });
  }
  next();
};

export const validateContactUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      status: "Validation Error",
      message: error.details[0].message,
    });
  }
  next();
};

export const validateFavoritePatch = (req, res, next) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: 400,
      status: "Validation Error",
      message: error.details[0].message,
    });
  }
  next();
};
