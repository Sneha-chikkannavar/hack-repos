// ---------- MATRIX RAIN ANIMATION (CORRECTED) ----------
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let width, height, drops, columns;

// Define constants before any function that uses them
const chars = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:<>?";
const fontSize = 16;      // Moved before resizeCanvas

function initMatrix() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height / fontSize);
    }
}

function drawMatrix() {
    ctx.fillStyle = "rgba(10, 15, 28, 0.07)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0f8";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
}

// Initialize and start
initMatrix();
window.addEventListener('resize', () => {
    initMatrix();
    drawMatrix(); // redraw immediately after resize
});
drawMatrix();

// ---------- TOAST NOTIFICATION ----------
function showToast(msg) {
    let toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------- SCAM IDENTIFICATION BUTTONS (SHOW DETAILED THREAT ALERT) ----------
document.querySelectorAll('.identify-threat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevents card click from also firing
        const scamName = btn.getAttribute('data-scam') || "unknown scam";
        
        // Detailed threat messages
        const threatDetails = {
            "OTP Scam": "⚠️ THREAT: OTP Scam – Fraudsters trick you into sharing One Time Password. Never share OTP with anyone, even if they claim to be from bank or government.",
            "Bank Scam": "⚠️ THREAT: Fake Bank Alert – Scammers send fake debit messages to make you call a fraudulent helpline. Always use official bank contact.",
            "Lottery Scam": "⚠️ THREAT: Lottery Scam – You cannot win a lottery you never entered. They ask for processing fee to steal your money.",
            "Phishing Email": "⚠️ THREAT: Phishing Email – Fake emails mimic real companies to steal your login details. Check sender address and hover over links."
        };
        
        const message = threatDetails[scamName] || `⚠️ Threat Identified: ${scamName} – Do NOT respond. Report immediately to cyber helpline 1930.`;
        
        // Show as popup alert (you can change to showToast if you prefer)
        alert(message);
        
        // To use a toast notification instead of alert, comment out the line above and uncomment the next line:
        // showToast(message);
    });
});

// ---------- FRAUD REPORT FORM HANDLER (USING FETCH) ----------
const reportForm = document.getElementById('fraudReportForm');
const reportStatus = document.getElementById('reportStatus');

if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('repName', document.getElementById('repName').value.trim());
        formData.append('repEmail', document.getElementById('repEmail').value.trim());
        formData.append('scamType', document.getElementById('scamType').value);
        formData.append('scamDesc', document.getElementById('scamDesc').value.trim());
        const fileInput = document.getElementById('screenshotUpload');
        if (fileInput.files[0]) formData.append('screenshot', fileInput.files[0]);

        const submitBtn = reportForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/report', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) {
                reportStatus.innerHTML = "✅ Report submitted! CyberShield team will review & take action.";
                reportForm.reset();
                fetchStats();
                showToast('Report sent successfully');
            } else {
                reportStatus.innerHTML = `❌ Error: ${data.message}`;
            }
        } catch (err) {
            console.error(err);
            reportStatus.innerHTML = "❌ Network error. Is the backend running?";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
            setTimeout(() => { reportStatus.innerText = ""; }, 4000);
        }
    });
}

// ---------- FETCH STATS FROM BACKEND ----------
async function fetchStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        document.getElementById('fraudStat').innerText = stats.totalReports.toLocaleString();
        document.getElementById('protectedStat').innerText = (stats.protectedUsers / 1000).toFixed(1) + "K";
        document.getElementById('scamsDetected').innerText = stats.scamsDetected.toLocaleString();
    } catch (err) {
        console.warn("Stats fetch failed:", err);
    }
}
fetchStats();

// ---------- ROTATING SAFETY TIPS & THREATS ----------
const tipsList = [
    "🔐 Never reuse passwords across critical accounts.",
    "📞 Govt agencies never ask for OTP over call.",
    "🛡️ Update software regularly to patch vulnerabilities.",
    "⚠️ Avoid public Wi-Fi for banking transactions.",
    "🔍 Verify email sender addresses before clicking links."
];
const threatList = [
    "⚠️ New QR code scam at parking lots — stay cautious.",
    "🚨 'Fake KYC' messages circulating via SMS.",
    "📧 AI-powered phishing emails becoming indistinguishable.",
    "💳 Skimming devices reported at ATMs in Bangalore."
];
let tipIndex = 0, threatIndex = 0;

setInterval(() => {
    const dailyTip = document.getElementById('dailyTip');
    const latestThreat = document.getElementById('latestThreat');
    if (dailyTip) {
        tipIndex = (tipIndex + 1) % tipsList.length;
        dailyTip.innerHTML = tipsList[tipIndex];
    }
    if (latestThreat) {
        threatIndex = (threatIndex + 1) % threatList.length;
        latestThreat.innerHTML = threatList[threatIndex];
    }
}, 7000);

// ---------- MULTI-LANGUAGE SELECTOR ----------
const langSelect = document.getElementById('langSelect');
const langMsg = document.getElementById('langMsg');
if (langSelect) {
    const translations = {
        en: "🌐 Language: English | Stay cyber aware!",
        hi: "🌐 भाषा: हिंदी | साइबर जागरूक रहें!",
        kn: "🌐 ಭಾಷೆ: ಕನ್ನಡ | ಸೈಬರ್ ಜಾಗೃತಿ ಮುಖ್ಯ!",
        te: "🌐 భాష: తెలుగు | సైబర్ అవగాహన కలిగి ఉండండి!"
    };
    langSelect.addEventListener('change', (e) => {
        const msg = translations[e.target.value] || "Language support active | Stay protected!";
        langMsg.innerText = msg;
        showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
    });
}

// ---------- HERO BUTTONS (SMOOTH SCROLL) ----------
document.getElementById('learnCyberBtn')?.addEventListener('click', () => {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('reportScamHeroBtn')?.addEventListener('click', () => {
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
});

// ---------- INTERACTIVE LEARNING MODULES ----------
// When any module card is clicked, show a helpful message or open a resource
// ---------- LEARNING MODULES - CLICK FOR CYBER TIPS (NO VIDEOS) ----------
const moduleCards = document.querySelectorAll('.modules-grid .card');

const safetyMessages = {
    "Phishing Awareness": "🔐 Phishing attacks trick you into sharing passwords or OTPs. Always check sender email addresses, hover over links before clicking, and never respond to urgent 'verify account' requests.",
    "Password Security": "🔑 Create strong, unique passwords for every account. Use a password manager (Bitwarden, LastPass). Turn on 2FA (two‑factor authentication) wherever possible.",
    "Social Media Safety": "📱 Set profiles to private, avoid posting live locations, don't share personal IDs, and be careful with online quizzes that ask security questions.",
    "Online Payment Protection": "💳 Use only trusted payment gateways. Never save card details on shopping sites. Enable SMS alerts for transactions. Never share UPI PIN or OTP.",
    "Malware Detection": "🦠 Install reputable antivirus (Windows Defender, Malwarebytes). Keep your OS and apps updated. Avoid downloading cracked software or clicking suspicious pop‑ups."
};

moduleCards.forEach(card => {
    const titleElem = card.querySelector('h3');
    if (!titleElem) return;
    const title = titleElem.innerText.trim();

    // Make card look clickable
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 0 15px rgba(0, 247, 255, 0.6)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
    });

    // Show message on click
    card.addEventListener('click', () => {
        const msg = safetyMessages[title];
        if (msg) {
            alert(`🛡️ ${title}\n\n${msg}`);
        } else {
            alert(`📘 ${title}\n\nStay tuned for more cyber safety tips!`);
        }
    });
});

// ---------- SCAM EXAMPLES DATABASE - CLICKABLE CARDS (NO VIDEOS) ----------
const scamCards = document.querySelectorAll('.scam-grid .card');

const scamMessages = {
    "📱 Fake OTP Scam": "🚨 Never share your OTP with anyone, even if they claim to be from your bank or a government agency. Banks never ask for OTP. Block and report such messages immediately.",
    "🏦 Fake Bank Message": "🏦 Do not call the number in the message or click any link. Always contact your bank using the official number on the back of your card or their verified website.",
    "🎉 Lottery Scam": "💰 If you didn't enter a lottery, you cannot win it. Real lotteries never ask you to pay a 'processing fee' before receiving your prize. Ignore and delete these messages.",
    "📧 Phishing Email": "📧 Check the sender's email address carefully. Hover over links to see the real URL. Do not enter login details on pages that come from unsolicited emails. Report phishing to the real company."
};

scamCards.forEach(card => {
    // Find the h3 title inside the card
    const titleElem = card.querySelector('h3');
    if (!titleElem) return;
    let title = titleElem.innerText.trim();
    // Normalize: remove emojis/spaces for matching (but keep original for display)
    const cleanTitle = title.replace(/[^a-zA-Z ]/g, '').trim();
    
    // Find matching key in scamMessages (fuzzy match)
    let matchedKey = null;
    for (let key in scamMessages) {
        if (title.includes(key.replace(/[^a-zA-Z ]/g, '')) || key.includes(cleanTitle)) {
            matchedKey = key;
            break;
        }
    }
    // Fallback: if title contains key words
    if (!matchedKey) {
        if (title.includes("OTP")) matchedKey = "📱 Fake OTP Scam";
        else if (title.includes("Bank")) matchedKey = "🏦 Fake Bank Message";
        else if (title.includes("Lottery")) matchedKey = "🎉 Lottery Scam";
        else if (title.includes("Phishing")) matchedKey = "📧 Phishing Email";
    }
    
    // Make card clickable
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 0 15px rgba(255, 0, 100, 0.5)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '';
    });
    
    // Show message on card click (not just button)
    card.addEventListener('click', (e) => {
        // Prevent triggering twice if button inside card is clicked (event bubbling)
        if (e.target.classList && e.target.classList.contains('identify-threat-btn')) {
            return; // Let the button handle it separately
        }
        const msg = scamMessages[matchedKey] || "⚠️ This is a typical scam example. Do not respond, do not share personal info, and report it to the cyber helpline (1930).";
        alert(`🚨 SCAM ALERT\n\n${title}\n\n${msg}`);
    });
});

console.log("CyberShield active — connected to backend API.");