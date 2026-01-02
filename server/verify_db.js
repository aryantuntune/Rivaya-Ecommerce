const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Banner = require('./models/Banner');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        const count = await Banner.countDocuments();
        console.log(`Banner Count: ${count}`);

        const banners = await Banner.find({});
        console.log(JSON.stringify(banners, null, 2));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyData();
