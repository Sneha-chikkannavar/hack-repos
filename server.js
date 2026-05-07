const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const REPORTS_FILE = './reports.json';

function readReports() {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(REPORTS_FILE));
    } catch (e) {
        return [];
    }
}

function writeReports(reports) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
}

app.post('/api/report', upload.single('screenshot'), (req, res) => {
    const { repName, repEmail, scamType, scamDesc } = req.body;
    if (!repName || !repEmail) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }
    const newReport = {
        id: Date.now(),
        repName,
        repEmail,
        scamType: scamType || 'Not specified',
        scamDesc: scamDesc || '',
        screenshot: req.file ? req.file.filename : null,
        timestamp: new Date().toISOString()
    };
    const reports = readReports();
    reports.push(newReport);
    writeReports(reports);
    res.json({ success: true, message: 'Report submitted successfully!' });
});

app.get('/api/stats', (req, res) => {
    const reports = readReports();
    const totalReports = reports.length;
    res.json({
        totalReports,
        protectedUsers: 189200 + totalReports * 2,
        scamsDetected: 9423 + totalReports
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ CyberShield backend running at http://localhost:${PORT}`);
});