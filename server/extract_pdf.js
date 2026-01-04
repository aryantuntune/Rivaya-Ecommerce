const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

// Path to the PDF in the parent directory
const pdfPath = path.join(__dirname, '../Privacy Policy Rivaya.pdf');

try {
    if (fs.existsSync(pdfPath)) {
        let dataBuffer = fs.readFileSync(pdfPath);
        console.log("Require type:", typeof pdf);
        if (typeof pdf !== 'function') {
            // Maybe it's a default export issue in newer node
            const pdfFunc = pdf.default || pdf;
            if (typeof pdfFunc === 'function') {
                pdfFunc(dataBuffer).then(function (data) {
                    console.log("---START PDF CONTENT---");
                    console.log(data.text);
                    console.log("---END PDF CONTENT---");
                });
            } else {
                console.log("Still not a function", pdf);
            }
        } else {
            pdf(dataBuffer).then(function (data) {
                console.log("---START PDF CONTENT---");
                console.log(data.text);
                console.log("---END PDF CONTENT---");
            }).catch(err => {
                console.error("PDF Parse Error:", err);
            });
        }
    } else {
        console.error("File not found at:", pdfPath);
    }
} catch (e) {
    console.error("Script Error:", e);
}
