const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('./models/User');

// Load Env
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

if (!process.env.MONGODB_URI) {
    console.error("CRITICAL: MONGODB_URI is not defined.");
    process.exit(1);
}

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        const adminEmail = 'admin@rivaya.com';
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Find and update, or create
        const admin = await User.findOneAndUpdate(
            { email: adminEmail },
            {
                name: 'System Admin',
                firstName: 'System',
                lastName: 'Admin',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true, text: true } // 'text' isn't valid, but standard options used
        );

        console.log("-----------------------------------------");
        console.log("✅ ADMIN PASSWORD RESET SUCCESSFULLY");
        console.log(`📧 Email:    ${adminEmail}`);
        console.log(`🔑 Password: ${newPassword}`);
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error Resetting Admin:", error);
        process.exit(1);
    }
};

resetAdmin();
