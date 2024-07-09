const { check, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ field: err.path, message: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};