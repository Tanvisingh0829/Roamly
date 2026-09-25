# 🌍 Roamly — Travel & Property Listing Platform

Roamly is a full-stack travel and property listing platform where users can discover listings, search and filter destinations, view property galleries, create listings, and leave reviews.

The project was built on a full-stack learning foundation and extended with several custom features focused on image management and listing discovery.
## 🚀 Live Demo

🌐 **[Visit Roamly](https://roamly-six-lemon.vercel.app/listings)**

> Try browsing listings, searching by destination, creating an account, adding listings, uploading images, and leaving reviews.
## 🎯 Features

### Core Features
- User registration and login
- Authentication and authorization
- Create, edit, and delete property listings
- Owner-based listing access control
- Reviews and 1–5 star ratings
- Flash messages and centralized error handling
- Responsive Bootstrap-based interface
- Cloudinary-powered image storage

### Custom Features Added
The following features were added beyond the original base application:

- **Multi-image listings** — upload and store up to 5 images per listing.
- **Image upload validation** — maximum 5 MB per image with JPEG/JPG, PNG, and WEBP validation.
- **Image gallery** — display multiple listing images with a main image and selectable thumbnails.
- **Functional category filtering** — filter listings by categories such as Mountains, Beaches, Camping, Adventure, and more.
- **Search** — case-insensitive search across listing title, location, and country.
- **Price filtering** — filter listings using minimum and maximum price.
- **Customized frontend styling** — Bootstrap combined with project-specific CSS for listing cards, category navigation, forms, gallery presentation, and responsive layouts.

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- EJS
- EJS-Mate
- Bootstrap

**Backend**
- Node.js
- Express.js
- Mongoose
- MongoDB

**Authentication & Validation**
- Passport.js
- Passport Local
- Passport Local Mongoose
- Joi

**File Upload & Storage**
- Multer
- Multer Storage Cloudinary
- Cloudinary

**Other**
- Express Session
- Connect Flash
- Method Override
- dotenv

## Key Technical Implementations

### Multi-image upload

Listings use an `images` array containing Cloudinary URLs and filenames:

```js
images: [
  {
    url: String,
    filename: String
  }
]
```

Multer processes multiple files in a single request, with a maximum of five uploads.

### Upload validation

Image uploads are validated using Multer before being processed by the application.

- Maximum file size: **5 MB**
- Maximum images per listing: **5**
- Supported formats: **JPEG/JPG, PNG, WEBP**

During editing, the backend also checks the existing image count before allowing additional uploads.

### Search and filtering

Listing discovery is handled server-side using MongoDB/Mongoose queries.

Supported query parameters include:

```text
/listings?search=Manali
/listings?category=Mountains
/listings?minPrice=1000&maxPrice=5000
```

Search can match:
- Title
- Location
- Country

Category, search, and price filters can also be combined.

### Authentication and authorization

Passport handles user authentication, while middleware protects listing operations.

Only authenticated users can create listings, and only listing owners can edit or delete their own listings.

### Cloudinary integration

Uploaded listing images are stored on Cloudinary rather than directly on the application server. MongoDB stores the associated Cloudinary URL and filename.

## How the Application Works

At a high level:

```text
User
  │
  ├── Register / Login
  │
  ▼
Express Routes
  │
  ├── Authentication & Authorization
  ├── Joi Validation
  ├── Multer Image Validation
  │
  ▼
Controllers
  │
  ├── Listing CRUD
  ├── Search & Filtering
  └── Review Operations
  │
  ├──────────────► MongoDB / Mongoose
  │
  └──────────────► Cloudinary
                         │
                         ▼
                    Image Storage
  │
  ▼
EJS Views + Bootstrap + CSS
  │
  ▼
User Interface
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Roamly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Do not commit `.env` or real credentials to GitHub.

### 4. Start MongoDB

Roamly currently uses a local MongoDB database:

```text
mongodb://127.0.0.1:27017/roamly
```

Make sure MongoDB is running before starting the application.

### 5. Start the application

```bash
node app.js
```

The application runs on:

```text
http://localhost:8080
```

## Database Setup

Roamly uses MongoDB with Mongoose.

The main collections/models are:

- `User` — registered users and authentication data
- `Listing` — property/travel listings
- `Review` — reviews associated with listings

The application connects to the local `roamly` database automatically when started.

If sample data is required, the project also contains initialization scripts under the `init/` directory.

## Cloudinary Setup

Roamly uses Cloudinary for listing image storage.

1. Create a Cloudinary account.
2. Obtain your Cloudinary:
   - Cloud name
   - API key
   - API secret
3. Add these values to `.env`:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Images are uploaded to the application's Cloudinary folder and their URLs are stored with the listing data in MongoDB.

## Screenshots

Add screenshots of the deployed application here.

Recommended screenshots:

### Listings / Home Page

<img width="1514" height="689" alt="image" src="https://github.com/user-attachments/assets/31a1dee6-915d-41bd-9542-9ef400116081" />


### Listing Details & Image Gallery

<img width="731" height="620" alt="image" src="https://github.com/user-attachments/assets/a6888f54-6a49-453a-8bca-eab2c825da0f" />


### Create Listing

<img width="1498" height="656" alt="image" src="https://github.com/user-attachments/assets/c8f65ee2-fc15-49e4-9532-279f364e7018" />


### Search & Filters

<img width="1508" height="215" alt="image" src="https://github.com/user-attachments/assets/3ee10957-383d-4034-9924-81c5c3c59e5c" />

## Project Structure

```text
Roamly/
├── controllers/
├── init/
├── models/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── utils/
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── reviews/
│   └── users/
├── app.js
├── cloudConfig.js
├── middlewares.js
├── schema.js
├── package.json
└── .env
```

## Future Improvements

Potential future improvements include:

- Cloud/deployed MongoDB database
- Production deployment
- Improved image management, including image deletion/reordering
- Pagination for large numbers of listings
- More advanced filtering and sorting
- Wishlist/favorites
- Booking functionality
- Map-based location discovery
- Improved automated testing

## Author

**Tanvi Singh**

Roamly was developed as a full-stack web development project to practice and demonstrate backend development, database integration, authentication, file uploads, cloud storage, server-side filtering, and frontend development.
