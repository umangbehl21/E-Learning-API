const multer = require("multer");
const path = require("path");

// Define storage configuration for Multer
const storageConfig = multer.diskStorage({
  // Destination is the specified directory for storing images
  destination: 'C:\\Users\\HP\\E-Learning\\Project\\imagesPath',
  // File name is prepended with the current time in milliseconds to handle duplicate file names
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for filtering only images
const fileFilterConfig = function(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // Calling callback with true as mimetype of file is image
    cb(null, true);
  } else {
    // False to indicate not to store the file
    cb(null, false);
  }
};

// Creating multer object for storing with configuration
const upload = new multer({
  // Applying storage and file filter
  storage: storageConfig,
  limits: {
    // Limit file size to 5 MB
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilterConfig,
});

module.exports = upload;
