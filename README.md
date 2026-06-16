# 🎌 AniReview

AniReview is a full-stack anime review platform where users can browse anime information, read community reviews, and submit their own reviews for their favorite anime series.

Built using modern web technologies including HTML, CSS, JavaScript, Node.js, Express.js, MongoDB Atlas, and Mongoose.

---

## 🚀 Features

* Browse popular anime titles
* Dedicated anime detail pages
* Read community reviews
* Submit reviews with ratings
* Dynamic review loading from MongoDB Atlas
* REST API powered backend
* Responsive design for desktop and mobile
* Smooth animations and interactive UI

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

---

## 📂 Project Structure

```bash
AniReview/
│
├── models/
│   └── Review.js
│
├── server.js
│
├── index.html
├── index.css
├── index.js
│
├── onepiece.html
├── aot.html
├── demonslayer.html
├── jjk.html
│
├── anime-page.js
│
└── assets/
```

## ⚡ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/anireview.git
cd anireview
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
```

### 4. Start Backend Server

```bash
node server.js
```

Server will run on:

```bash
http://localhost:5000
```

### 5. Run Frontend

Open the project using VS Code Live Server or any local web server.

```bash
http://localhost:5500
```

---

## 📡 API Endpoints

### Get All Reviews

```http
GET /reviews
```

### Get Reviews By Anime

```http
GET /reviews/:anime
```

Example:

```http
GET /reviews/One Piece
```

### Submit Review

```http
POST /reviews
```

Request Body:

```json
{
  "name": "Shubham",
  "anime": "One Piece",
  "rating": 5,
  "review": "Peak Fiction"
}
```

---

## 🎯 Future Improvements

* User Authentication
* Google Login
* User Profiles
* Edit/Delete Reviews
* Anime Search
* Review Likes
* Review Sorting & Filtering
* Admin Dashboard

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Anime Detail Page
* Review System
* MongoDB Database

---

## 👨‍💻 Author

Shubham

Built as a full-stack web development project to practice frontend development, REST APIs, Express.js, and MongoDB integration.
