import { Consumption } from "#models/consumption.model.js";
import { Product } from "#models/product.model.js";
import { User } from "#models/user.model.js";
import mongoose from "mongoose";
import { env } from "./index.js";


const MONGO_URI = `${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`; 


const randomRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const lastNDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - randomRange(0, days));
    d.setHours(randomRange(6, 21), randomRange(0, 59), 0, 0);
    return d;
};

const PRODUCT_TEMPLATES = [
    { name: "Red Bull", sugar: 27, caffeine: 0.08, calories: 112 },
    { name: "Monster Ultra", sugar: 0, caffeine: 0.14, calories: 10 },
    { name: "Coca Cola", sugar: 39, caffeine: 0.034, calories: 140 },
    { name: "Pepsi", sugar: 41, caffeine: 0.038, calories: 150 },
    { name: "Rockstar", sugar: 30, caffeine: 0.16, calories: 120 }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        await Product.deleteMany({});
        await User.deleteMany({});
        await Consumption.deleteMany({});
        console.log("Cleared collections");

        const users = await User.insertMany([
            { firstName: "Alice", lastName: "Tester", password: "password123", email: "alice@test.com" },
            { firstName: "Bob", lastName: "Analytics", password: "password123", email: "bob@test.com" },
            { firstName: "Charlie", lastName: "User", password: "password123", email: "charlie@test.com" }
        ]);
        console.log("Seeded users:", users.length);

        const products = await Promise.all(
            PRODUCT_TEMPLATES.map(async (p, i) =>
                Product.create({
                    name: p.name,
                    brand: p.name.split(" ")[0],
                    barcode: "TEST" + i,
                    imageUrl: "",
                    sugar: p.sugar,
                    caffeine: p.caffeine,
                    calories: p.calories
                })
            )
        );
        console.log("Seeded products:", products.length);

        const consumptions: any[] = [];

        for (let i = 0; i < 150; i++) {
            const product = products[randomRange(0, products.length - 1)];
            const user = users[randomRange(0, users.length - 1)];

            consumptions.push({
                product: product._id,
                contributorId: user._id,
                quantity: randomRange(1, 3),
                time: lastNDays(30),
                place: "TestPlace",
                notes: ""
            });
        }

        await Consumption.insertMany(consumptions);
        console.log("Seeded consumptions:", consumptions.length);

        console.log("🌱 Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
