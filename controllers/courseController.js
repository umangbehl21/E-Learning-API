const { knex } = require('knex'); // Import the Knex library and its destructuring

const knexConfig = require('../knexfile');
const {sendCourseEnrollmentNotification } = require('./emailController')
// Initialize Knex with the configuration for PostgreSQL
const knexInstance = knex(knexConfig.development); // Use knexConfig.development for the PostgreSQL configuration

const createCourse = async (req, res) => {
    try {
      // Extract course data from the request body
      const { title, description, instructor, duration, category, level } = req.body;
  
      // Validate course data (optional)
  
      // Insert the new course into the database
      const courseId = await knexInstance('courses').insert({
        title,
        description,
        instructor,
        duration,
        category,
        level
      }).returning('id'); // Return the ID of the newly inserted course
  
      // Respond with the ID of the newly created course
      res.status(201).json({ id: courseId[0], message: 'Course created successfully.' });
    } catch (error) {
      // Handle errors
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
  const deleteCourse = async (req, res) => {
    try {
      // Extract course ID from the request body
      const { courseId } = req.body;
  
      // Check if the courseId is provided
      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required.' });
      }
  
      // Delete related enrollment records
      await knexInstance('user_course_enrollments').where({ course_id: courseId }).del(); //if a course is deleted student enrolled in that course this record also get deleted 
  
      // Delete the course from the database
      await knexInstance('courses').where({ id: courseId }).del();
  
      // Respond with a success message
      res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (error) {
      // Handle errors
      console.error('Error deleting course:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  const enrollment = async (req, res) => {
    try {
      // Extract user ID from the authenticated token
      const userId = req.user.userId;
  
      // Extract course name from the request body
      const { coursename } = req.body;
  
      // Check if the course name is provided
      if (!coursename) {
        return res.status(400).json({ error: 'Course name is required.' });
      }
  
      // Retrieve the course from the database based on the course name
      const course = await knexInstance('courses').where('title', coursename).first();
  
      // Check if the course exists
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }
  
      // Check if the user is already enrolled in the course
      const existingEnrollment = await knexInstance('user_course_enrollments')
        .where({ user_id: userId, course_id: course.id })
        .first();
  
      if (existingEnrollment) {
        return res.status(400).json({ error: 'User is already enrolled in this course.' });
      }
  
      // Insert a new entry into the enrollment table
      await knexInstance('user_course_enrollments').insert({ user_id: userId, course_id: course.id });
  
      // Send enrollment notification email
      await sendCourseEnrollmentNotification(userId, course.id);
  
      // Return success response
      res.status(201).json({ message: 'Course enrollment successful.' });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  const updateCourse = async (req, res) => {
    try {
      // Extract course ID and updated course data from the request body
      const { courseId, updatedCourseData } = req.body; // Assuming courseId and updatedCourseData are provided in the request body
  
      // Check if the courseId and updatedCourseData are provided
      if (!courseId || !updatedCourseData) {
        return res.status(400).json({ error: 'Course ID and updated course data are required.' });
      }
  
      // Check if the course exists in the database
      const course = await knexInstance('courses').where({ id: courseId }).first();
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }
  
      // Update the course in the database with the provided data
      await knexInstance('courses').where({ id: courseId }).update(updatedCourseData);
  
      // Respond with a success message
      res.status(200).json({ message: 'Course updated successfully.' });
    } catch (error) {
      // Handle errors
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };



module.exports = {createCourse , enrollment , deleteCourse , updateCourse};











