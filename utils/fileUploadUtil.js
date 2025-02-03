const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Generates a Multer middleware for dynamic directories.
 * @param {string} dirPath - Directory to upload files
 * @returns {Multer} Configured multer instance
 */
const createUploader = (dirPath) => {
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dirPath); // Save files in the provided directory
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  // Multer instance
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit

    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = allowedTypes.test(file.mimetype);
      if (extName && mimeType) {
        return cb(null, true);
      }
      cb(new Error('Only images are allowed (jpeg, jpg, png, webp)!'));
    },
  });
};

module.exports = createUploader;
