const path = require("path");
const User = require("../models/User");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("../config/db");


const seedAdmins = async () => {
    try {
        const mongoose = require("mongoose");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for Seeding");

        // Clear existing users to avoid duplicates during testing (optional)
        // await User.deleteMany({});

        const admins = [
            {
                name: "Report Admin",
                email: "s",
                mobile: "9550175369",
                password: "aditya@360",
                role: "REPORT_ADMIN"
            },
            {
                name: "Config Admin",
                email: "feedback360config@adityauniversity.in",
                mobile: "9550175369",
                password: "aditya@360",
                role: "CONFIG_ADMIN"
            }
        ];

        for (const admin of admins) {
            const userExists = await User.findOne({ email: admin.email });
            if (!userExists) {
                await User.create(admin);
                console.log(`[SUCCESS] Created admin: ${admin.name} (${admin.role})`);
            } else {
                console.log(`[SKIP] Admin already exists: ${admin.email}`);
            }
        }

        console.log("\nSeeding complete. Use these credentials to login:");
        console.log("-----------------------------------------");
        console.log("Reports Admin: report@example.com / password123");
        console.log("Config Admin:  config@example.com / password123");
        console.log("-----------------------------------------");

        process.exit();
    } catch (err) {
        console.error("[ERROR] Seeding failed:", err.message);
        process.exit(1);
    }
};

seedAdmins();
