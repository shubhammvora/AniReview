const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Review = require("./models/Review");
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://anireview:anireview123@cluster0.enb2wib.mongodb.net/anireview?retryWrites=true&w=majority")
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:");
    console.log(err);
});

// GET Reviews
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        console.log(err);
    }
});
app.get("/reviews/:anime", async (req, res) => {
    try {
        const reviews = await Review.find({
            anime: req.params.anime
        });

        res.json(reviews);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false
        });
    }   
});

// POST Reviews
app.post("/reviews", async (req, res) => {

    console.log("POST ROUTE HIT");

    try {
        const review = new Review(req.body);

        console.log("BEFORE SAVE");

        const savedReview = await review.save();

        console.log("AFTER SAVE");
        console.log(savedReview);

        res.json({
            success: true,
            message: "Review saved"
        });

    } catch (err) {

        console.log("ERROR:");
        console.log(err);

        res.status(500).json({
            success: false
        });
    }
});
// Root Route
app.get("/", (req, res) => {
    res.send("AniReview Backend Running");
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server Running on Port 5000");
});
