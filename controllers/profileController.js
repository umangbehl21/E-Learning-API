const cloudinary = require('../cloudinaryConfig')
const { knex } = require('knex'); // Import the Knex library and its destructuring

// Import the Knex configuration from knexfile.js
const knexConfig = require('../knexfile');
// Initialize Knex with the configuration for PostgreSQL
const knexInstance = knex(knexConfig.development); // Use knexConfig.development for the PostgreSQL configuration

// Controller function for uploading a profile picture
const uploadProfilePicture = async (req, res) => {    try {

  const profilePicture = req.file.fieldname;
  console.log(req.file)
      if (!req.file || !profilePicture) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
 
      //console.log(req.file)  

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result)
      // Get user ID from authentication (pseudo-code)
      const userId = req.user.userId;
  
      // Update user's profile picture in the database
      await knexInstance('users').where('id', userId).update({ profile_picture: result.public_id });

  
      // Respond with success message
      res.json({ message: 'Profile picture uploaded successfully', imageUrl: result.secure_url });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).json({ error: 'Failed to upload profile picture' });
    }
  };
  
  // Controller function for updating a profile picture
  const updateProfilePicture = async (req, res) => {
    try {
      const profilePicture = req.file.fieldname;
      if (!req.file || !profilePicture) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
    // Get user ID from authentication (pseudo-code)
      const userId = req.user.userId;

    // Update user's profile picture in the database
      await knexInstance('users').where('id', userId).update({ profile_picture: result.public_id });
      // Respond with success message
      res.json({ message: 'Profile picture updated successfully', imageUrl: result.secure_url });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ error: 'Failed to update profile picture' });
    }
  };

  module.exports = {updateProfilePicture,uploadProfilePicture}
