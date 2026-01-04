
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const Banner = require(path.join(__dirname, 'models/Banner'));

const seedBanners = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const count = await Banner.countDocuments();
        console.log(`Current Banner Count: ${count}`);

        if (count < 4) {
            const needed = 4 - count;
            console.log(`Creating ${needed} empty banner slots...`);

            // Find max order
            const lastBanner = await Banner.findOne().sort({ order: -1 });
            const startOrder = lastBanner && lastBanner.order ? lastBanner.order + 1 : 1;

            const newBanners = Array.from({ length: needed }).map((_, i) => ({
                title: `Banner Slot ${count + i + 1}`,
                subtitle: 'Edit to add content',
                image: 'https://via.placeholder.com/1200x500?text=Banner+Placeholder',
                link: '/shop',
                enabled: false,
                order: startOrder + i
            }));

            await Banner.insertMany(newBanners);
            console.log('Banner slots created!');
        } else {
            console.log('Sufficient banner slots exist.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedBanners();
