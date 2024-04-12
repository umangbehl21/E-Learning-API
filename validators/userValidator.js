const Joi = require('joi');

// Define schema for user registration data
const userRegistrationSchema = Joi.object({            //joi.object() is used to define an object schema.
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),   //tlds: { allow: ['com', 'net'] }: Specifies the allowed top-level domains (TLDs). Only email addresses with TLDs specified in the allow array (such as .com and .net) will be considered valid.
  password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),                //regular expressions (regex) are indeed an integral part of many programming languages and provide a powerful way to match patterns in strings.^ denotes the start of the string. [a-zA-Z0-9] matches any alphanumeric character (letters A-Z, a-z, and digits 0-9). {3,30} specifies the allowable length range of the preceding pattern, which, in this case, is [a-zA-Z0-9]. So, it means that the string can contain alphanumeric characters between 3 and 30 times. $ denotes the end of the string. This regex pattern ensures that the entire string consists of only alphanumeric characters and has a length between 3 and 30 characters.
});

// Validate user registration data
const validateUserRegistration = (data) => {
  return userRegistrationSchema.validate(data);      //.validate() method is part of the Joi object schema that is defined. When we create a schema using Joi.object(), we are creating a schema object that contains various validation methods, including .validate(). This method is used to validate input data against the defined schema.
};

module.exports = {
  validateUserRegistration,
};
