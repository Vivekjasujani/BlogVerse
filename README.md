# ✨ BlogVerse

BlogVerse is a dynamic web application crafted for users to articulate their thoughts and ideas through published articles. It seamlessly incorporates user authentication, a robust rich text editor, and a custom Express/MongoDB backend, ensuring a smooth and secure experience for writers and readers.

---
## 🚀 Features

- **User Authentication:** Guarantees secure signup and login using email credentials with JWT-based authentication.
- **Article Management:** Streamlines articles' creation, editing, and deletion with image upload support via Cloudinary.
- **Rich Text Editor:** Empowered by TinyMCE, the editor presents a range of formatting options, including font styles, colors, headings, indentations, images, tables, special characters, and numbering.
- **Browse Articles:** Users can peruse a dedicated section to read and engage with articles from other contributors.
- **Like System:** Users can like posts and view their liked posts in their profile.
- **User Profiles:** Customizable user profiles with location and bio information.

## 🛠️ Technologies Used

- **React (Frontend):** A versatile JavaScript library for crafting user interfaces.
- **Redux Toolkit:** State management for the application.
- **Tailwind CSS (Styling):** A utility-first CSS framework for constructing efficient and responsive designs.
- **Express.js (Backend):** A fast and minimalist web framework for Node.js.
- **MongoDB (Database):** A NoSQL database for storing user data and posts.
- **Cloudinary (Image Storage):** Cloud-based image storage and manipulation service.
- **JWT (Authentication):** JSON Web Tokens for secure user authentication.

## 📦 Dependencies

### Frontend
- **"@reduxjs/toolkit": "^2.2.7"**
- **"@tinymce/tinymce-react": "^5.1.1"**
- **"axios": "^1.7.3"**
- **"html-react-parser": "^5.1.12"**
- **"react": "^18.3.1"**
- **"react-dom": "^18.3.1"**
- **"react-hook-form": "^7.52.2"**
- **"react-redux": "^9.1.2"**
- **"react-router-dom": "^6.26.0"**

### Backend
- **"express": "^5.1.0"**
- **"mongoose": "^8.16.1"**
- **"jsonwebtoken": "^9.0.2"**
- **"bcryptjs": "^2.4.3"**
- **"cloudinary": "^2.6.1"**
- **"multer": "^2.0.1"**
- **"cors": "^2.8.5"**
- **"helmet": "^8.1.0"**

## 🚦 Running the Project

### Prerequisites
- Node.js installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for image storage

### Setup

1. **Clone the Repository:** `git clone https://github.com/Vivekjasujani/BlogVerse`
2. **Navigate to the Project Directory:** `cd BlogVerse`

### Backend Setup

3. **Navigate to server directory:** `cd server`
4. **Install Dependencies:** `npm install`
5. **Create `.env` file** (refer to `.env.example`):
   ```
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/blogverse?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
6. **Start the server:** `npm run dev`

### Frontend Setup

7. **Navigate to root directory:** `cd ..`
8. **Install Dependencies:** `npm install`
9. **Create `.env` file** (refer to `.env.example`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
10. **Start the frontend:** `npm run dev`

## 🌟 Usage

1. **Sign Up and Log In:** Establish an account using your email and log in to access the complete set of features.
2. **Create and Manage Articles:** Visit "Add Post" in the navbar to publish a post. Modify or delete your articles as needed.
3. **Explore All Posts:** Explore the "All Posts" section to discover articles published by other users.
4. **User Profile:** Customize your profile with location and bio, view your posts and liked posts.

## 📝 Rich Text Editor

The application employs TinyMCE, offering an intuitive and powerful rich text editing experience. Users can format text, insert multimedia elements, and create engaging articles reminiscent of professional word processors.

## 🌐 Backend Architecture

The backend is built with Express.js and MongoDB, featuring:
- RESTful API design
- JWT-based authentication with HTTP-only cookies
- Image upload and storage via Cloudinary
- Content sanitization for security
- Rate limiting and CORS protection
- Comprehensive error handling

## 🚀 Deployment

### Live Demo
- **Frontend:** [BlogVerse](https://blog-verse-ee9w-pv5k4sc0z-vivekjasujanis-projects.vercel.app/)
- **Backend API:** [BlogVerse API](https://blogverse-api-of87.onrender.com/)

### Deployment Guide

#### Backend Deployment (Render)

1. **Push code to GitHub** if not already done
2. Go to [render.com](https://render.com) and sign up
3. Create a new **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** blogverse-api
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/blogverse?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
7. Deploy and copy the backend URL

#### Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (leave empty)
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy and copy the frontend URL

#### Important Notes

- **MongoDB Atlas:** Whitelist `0.0.0.0/0` in Network Access to allow Render's dynamic IPs
- **CORS Configuration:** Update `CLIENT_URL` on Render to match your Vercel frontend URL
- **Free Tier Limitations:** Render free tier spins down after 15 minutes of inactivity (takes ~30s to wake up)
- **Environment Variables:** Both deployments require proper environment variables to function correctly

## 📞 Contact Information

- **GitHub:** [Vivekjasujani ](https://github.com/Vivekjasujani)
- **LinkedIn:** [Vivek Jasujani](https://www.linkedin.com/in/vivek-jasujani-907526224/)
