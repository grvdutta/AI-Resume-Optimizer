const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdf(fileBuffer);
    return data.text;
}

// Function to generate mock analysis
function generateMockAnalysis(resumeText, jobDescription) {
    const stopWords = [
        "looking", "for", "with", "and", "the", "a", "an", "to", "of", "in", "skills",
        "is", "on", "at", "by", "from", "that", "this", "your", "have", "been", "software",
        "developer", "engineer", "experience", "work", "job", "description", "requirements",
        "about", "highly", "motivated", "seeking", "dynamic", "team", "environment", "roles",
        "including", "through", "well", "plus", "will", "would", "shall", "must", "should"
    ];

    const importantPhrases = ["node.js", "rest api", "problem solving"];

    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    // 1. Detect important multi-word phrases
    const detectedPhrases = importantPhrases.filter(phrase => jdLower.includes(phrase));

    // 2. Clean text and extract keywords (removing punctuation but keeping some context)
    // We remove most punctuation to get clean words
    const cleanJD = jdLower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");
    const words = cleanJD.split(/\s+/)
        .filter(word => {
            return word.length > 3 && !stopWords.includes(word);
        });

    // 3. Combine unique keywords and phrases
    const uniqueKeywords = [...new Set([...detectedPhrases, ...words])];

    const matchedKeywords = uniqueKeywords.filter(key => resumeLower.includes(key));
    const missingKeywords = uniqueKeywords.filter(key => !resumeLower.includes(key));

    const matchScore = uniqueKeywords.length > 0
        ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
        : 0;

    const suggestions = missingKeywords.slice(0, 3).map(key => `Consider adding experience related to "${key}"`);
    if (matchScore >= 80) {
        suggestions.unshift("Great match! Your resume aligns well with most requirements.");
    } else if (matchScore < 50 && matchScore > 0) {
        suggestions.push("Try to include more specific technical terms mentioned in the job description.");
    } else if (matchScore === 0) {
        suggestions.push("No significant keyword matches found. Check if the job description is relevant to your background.");
    }

    return {
        matchScore,
        matchedKeywords,
        missingKeywords,
        suggestions
    };
}

// Upload endpoint
app.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        const jobDescription = req.body.jobDescription;

        // Validation
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded.' });
        }
        if (!jobDescription || jobDescription.trim() === "") {
            return res.status(400).json({ error: 'Job description is empty.' });
        }

        console.log(`Processing file: ${req.file.originalname}`);

        // 1. Extract text from PDF
        const resumeText = await extractTextFromPDF(req.file.path);

        // 2. Generate Analysis (Mock AI)
        const analysisResult = generateMockAnalysis(resumeText, jobDescription);

        // 3. Cleanup: Delete the uploaded file after processing
        fs.unlinkSync(req.file.path);

        // 4. Return results
        res.json({
            message: "Analysis complete (Offline Mode)",
            fileName: req.file.originalname,
            ...analysisResult
        });
    } catch (err) {
        console.error('Processing error:', err);
        res.status(500).json({ error: "Failed to process resume. " + err.message });
    }
});

// Error handling for Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Only PDF files are allowed!') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

