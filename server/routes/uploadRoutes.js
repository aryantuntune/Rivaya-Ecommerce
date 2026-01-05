const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload single file
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            filePath: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// @desc    Upload multiple files with Compression
// @route   POST /api/upload/multiple
// @access  Public
router.post('/multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const processedFiles = [];

        for (const file of req.files) {
            const { path: filePath, filename, destination } = file;
            const newFilename = `opt-${filename.split('.')[0]}.jpg`;
            const newPath = path.join(destination, newFilename);

            // Compress and resize
            await sharp(filePath)
                .resize(1200, 1200, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80, mozjpeg: true })
                .toFile(newPath);

            // Remove original large file
            fs.unlinkSync(filePath);

            processedFiles.push(`/uploads/${newFilename}`);
        }

        res.status(200).json({
            success: true,
            message: 'Files uploaded and optimized successfully',
            filePaths: processedFiles
        });
    } catch (error) {
        console.error('Optimization Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
