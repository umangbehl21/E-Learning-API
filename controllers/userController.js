require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendConfirmationEmail , sendForgotPasswordEmail} = require('./emailController')
const { validateUserRegistration } = require('../validators/userValidator');
const { knex } = require('knex'); // Import the Knex library and its destructuring

// Import the Knex configuration from knexfile.js
const knexConfig = require('../knexfile');

// Initialize Knex with the configuration for PostgreSQL
const knexInstance = knex(knexConfig.development); // Use knexConfig.development for the PostgreSQL configuration

// User registration controller function
const registerUser = async (req, res) => {
  try {
    // Validate request body against user registration schema
    const { error, value } = validateUserRegistration(req.body);

    // If validation fails, respond with error messages
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email is already registered
    const existingUser = await knexInstance('users').where('email', value.email).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });      
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Insert user data into the database
    await knexInstance('users').insert({
      name: value.name,
      email: value.email,
      password: hashedPassword,
      profile_picture: null,
    });

    // Send confirmation email
    await sendConfirmationEmail(value.email);

    // Respond with success message
    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// User profile controller function
const loginUser = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Fetch user data from the database based on the provided email
    const user = await knexInstance('users').select().where('email', email).first();

    // Check if the user exists and the password is correct
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token with user payload including user ID, email, and role
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role  // Assuming user role is stored in the 'role' column
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set the token as a cookie with a unique name for each user
    res.cookie(`jwt_token_${user.id}`, token, { httpOnly: true }); // Set the cookie name to include the user's ID
    
    // Respond with the generated token
    res.status(200).json({ token });
  } catch (error) {
    // Handle errors
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};



const userDetails = async (req, res) => {
  try {
    // Extract user ID from decoded JWT token
    const userId = req.user.userId;

    // Fetch user data from the database based on the user ID
    const user = await knexInstance('users').select('name', 'email', 'profile_picture').where('id', userId).first();

    // Respond with the user's profile information
    res.status(200).json({ user });
  } catch (error) {
    // Handle errors
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};   

const updateUserProfile = async (req, res) => {
  try {
    // Extract user ID from decoded JWT token
    const userId = req.user.userId;
    
    // Extract updated profile data from request body
    const { name, email, profile_picture } = req.body;

    await knexInstance('users')
      .where('id', userId)
      .update({
        name,
        email,
        profile_picture,
      });


    // Update user profile data in the database
    // Respond with success message
    res.status(200).json({ message: 'User profile updated successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const createAdmin =  async (req, res) => {
  try {
      // Extract user data from request body
      const { name, email, password } = req.body;

      // Check if user with the provided email already exists
      const existingUser = await knexInstance('users').where({ email }).first();
      if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert admin user into the database
      await knexInstance('users').insert({
          name,
          email,
          password: hashedPassword,
          profile_picture: null,
          role: 'admin' // Set role to 'admin'
      });

      return res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    // Extract user ID from the authenticated token
    const userId = req.user.userId;

    // Fetch the courses in which the user is enrolled
    const enrolledCourses = await knexInstance('courses')
      .join('user_course_enrollments', 'courses.id', '=', 'user_course_enrollments.course_id')
      .where('user_course_enrollments.user_id', userId)
      .select('courses.*');

    // Return the list of enrolled courses
    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const filterCourses = async (req,res)=>
{
  try {
    // Extract filtering criteria from query parameters
    const { category, level } = req.query;

    // Build the Knex query dynamically based on the provided filtering criteria
    let query = knexInstance('courses');

    // Add filters based on the provided criteria
    if (category) {
        query = query.where('category', category);
    }
    if (level) {
        query = query.where('level', level);
    }

    // Execute the query
    const courses = await query.select('*');

    // Return the filtered courses
    res.status(200).json(courses);
} catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error.' });
}
}
const generateVerificationCode = () => {
  // Define the length of the verification code
  const codeLength = 6; // You can adjust the length as needed

  // Define the characters allowed in the verification code
  const characters = '0123456789';

  // Initialize an empty string to store the verification code
  let code = '';

  // Generate a random code by selecting random characters from the characters string
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  // Return the generated verification code
  return code;
};
const initiateForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await knexInstance('users').where({ email }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Generate verification code
    const verificationCode = generateVerificationCode();
    // Store the verification code in the verification table
    await knexInstance('verification').insert({ user_id: user.id, verification_code: verificationCode });
    // Send forgot password email with verification code
    await sendForgotPasswordEmail(email, verificationCode);
    res.json({ message: 'Forgot password email sent successfully' });
  } catch (error) {
    console.error('Error initiating forgot password process:', error);
    res.status(500).json({ error: 'Failed to initiate forgot password process' });
  }
};

// resetPassword function
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // Retrieve the user from the database based on the email
    const user = await knexInstance('users').where({ email }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Retrieve the verification code associated with the user
    const verification = await knexInstance('verification').where({ user_id: user.id }).first();
    if (!verification || verification.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password with the hashed password
    await knexInstance('users').where({ email }).update({ password: hashedPassword });
    // Delete the verification record
    await knexInstance('verification').where({ user_id: user.id }).del();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};


module.exports = { registerUser, loginUser , userDetails , updateUserProfile , createAdmin , getEnrolledCourses , filterCourses , initiateForgotPassword , resetPassword};



