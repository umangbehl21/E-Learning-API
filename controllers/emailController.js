const { Resend } = require('resend');
require('dotenv').config();
const { knex } = require('knex'); // Import the Knex library and its destructuring


// Import the Knex configuration from knexfile.js
const knexConfig = require('../knexfile');

// Initialize Knex with the configuration for PostgreSQL
const knexInstance = knex(knexConfig.development); // Use knexConfig.development for the PostgreSQL configuration


// Initialize Resend with API key
const resend = new Resend(process.env.EMAIL_API_KEY);

// Function to send a registration confirmation email
const sendConfirmationEmail = async (email) => {
  try {
    // Send the email using Resend's SDK
    const { data, error } = await resend.emails.send({
      from: 'BestTechCourses <onboarding@resend.dev>',
      to: [email], // Send the email to the registered user's email address
      subject: 'Registration Confirmation',
      html: '<p>Thank you for registering with us. We look forward to your course enrollment!</p>', // Customize the email content as needed
    });

    // Check for errors
    if (error) {
      console.error('Error sending confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }

    // Log the success message
    console.log('Confirmation email sent successfully:', data);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

const sendCourseEnrollmentNotification = async (userId, courseId) => {
    try {
      // Retrieve course details from the database
      const course = await knexInstance('courses').where('id', courseId).first();
  
      // Check if the course exists
      if (!course) {
        throw new Error('Course not found.');
      }
  
      // Retrieve user details (optional)
      // Replace 'users' with your actual users table name
      const user = await knexInstance('users').where('id', userId).first();
  
      // Compose email content
      const emailContent = `
        <p>Hello ${user.name || 'User'},</p>
        <p>You have successfully enrolled in the course "${course.title}".</p>
        <p>Description: ${course.description}</p>
        <p>Instructor: ${course.instructor}</p>
        <p>Duration: ${course.duration}</p>
        <p>Enjoy learning!</p>
      `;
  
      // Send the email using Resend's SDK
      const { data, error } = await resend.emails.send({
        from: 'BestTechCourses <onboarding@resend.dev>', 
        to: [user.email], // Send the email to the enrolled user's email address
        subject: 'Course Enrollment Notification',
        html: emailContent,
      });
  
      // Check for errors
      if (error) {
        console.error('Error sending course enrollment notification:', error);
        throw new Error('Failed to send course enrollment notification email');
      }
  
      // Log success message
      console.log('Course enrollment notification email sent successfully:', data);
    } catch (error) {
      console.error('Error sending course enrollment notification:', error);
      throw new Error('Failed to send course enrollment notification email');
    }
  };


  const sendForgotPasswordEmail = async (email,verificationCode) => {
    try {
     
      // Send email with verification code for forgot password
      const { data, error } = await resend.emails.send({
        from: 'BestTechCourses <onboarding@resend.dev>',
        to: [email],
        subject: 'Forgot Password - Verification Code',
        html: `<p>Your verification code for resetting the password is: ${verificationCode}</p>`,
      });
  
      if (error) {
        console.error('Error sending forgot password email:', error);
        throw new Error('Failed to send forgot password email');
      }
  
      console.log('Forgot password email sent successfully:', data);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new Error('Failed to send forgot password email');
    }
  };

module.exports = { sendConfirmationEmail , sendCourseEnrollmentNotification, sendForgotPasswordEmail}; 
