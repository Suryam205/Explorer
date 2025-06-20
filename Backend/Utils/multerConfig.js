// const multer = require('multer');
// const path = require('path');

// // Storage configuration
// const storage = multer.diskStorage({
  
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });

// // File type filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) cb(null, true);
//   else cb(new Error('Only images and videos are allowed'));
// };

// // Export multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 100 * 1024 * 1024 } // 100MB
// });

// module.exports = upload;

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'explorer-feeds', // folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif','mp4', 'mov'],
    resource_type: 'auto' // allows both images and videos
  }
});

const upload = multer({ storage });

module.exports = upload;



