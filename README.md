# Creating surf-shop web application

# Set up Express with Express generator to quickly set up skeleton folder structure

# Create database design on trello

# Setup routes for index, posts and reviews

# Create models for post, reviews and user

# Setup and configured passport

# Connect to MongoDB

# Adde header and footer ejs files in partials directory

# Refactor postRegister function to be async and added global errorHandler

# Add login/logout routes

# Update routes for posts and renamed routes to follow RESTful approach

# Add geolocation feature using Mapbox API

# Update Post Model and Controller

# Update Posts show view

# Upload images feature
* Create cloudinary account (or use existing)
* Install cloudinary and multer
* Cloudinary used to store images in cloud, and multer used to deal with multi form data and add additional images
* Configure multer for upload in routes file (maybe add image filter)
* Require and confiure cloudinary (api key, secret, etc)
* Update Post route
* Added the ability to upload multiple images (up to 4) per post

# Add favicon

# Configure EJS layouts to be served for different webpages

# Add flash messages
* Update pre-route middleware to check for error or success on session
* Update post-route error handling middleware to console.log full error and then redirect
* Create partial for flash messages and include it in layouts
* Write some success messages and throw some error to test it out

# Add Stripe payment (legacy method)
