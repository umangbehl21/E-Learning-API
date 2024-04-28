const express = require('express');
const router = express.Router();
const {registerUser , loginUser , userDetails , updateUserProfile , createAdmin , getEnrolledCourses , filterCourses , initiateForgotPassword , resetPassword} = require('../controllers/userController')
const {authenticateToken , checkAdmin} = require('../middlewares/authMiddleware');
const {createCourse , enrollment, deleteCourse , updateCourse} = require('../controllers/courseController')
const {updateProfilePicture} = require('../controllers/profileController')
const upload = require("../multer")

router.post('/register',registerUser)

router.post('/login', loginUser)

router.get('/profile', authenticateToken , userDetails); 

router.put('/profile', authenticateToken, updateUserProfile)

router.post('/admin', checkAdmin, createAdmin) //create admin a user has to be admin 

router.post('/createcourse', checkAdmin , createCourse)

router.delete('/deletecourse',checkAdmin , deleteCourse)

router.put('/updatecourse',checkAdmin , updateCourse)

router.post('/enroll',authenticateToken, enrollment)

router.get('/enrolled-courses',authenticateToken,getEnrolledCourses)

router.get('/filtercourses',filterCourses)

// Route for initiating forgot password process
router.get('/forgotpassword',initiateForgotPassword);

// Route for reseting password
router.post('/forgotpassword/reset', resetPassword);

// Update Profile Picture Route
router.put('/update-profile-picture', authenticateToken, upload.single('profilePicture'),updateProfilePicture);


module.exports = router;
