# Creating a craigslist like website

## Set up Express with Express generator to quickly set up skeleton folder structure
npm i -g express-generator
by default the view engine is set to pug, so change to express

## Create database design on trello

## Setup routes for index, posts and reviews

## Create models for post, reviews and user

## Setup and configure passport

## Setup and connect to MongoDB

## Add header and footer ejs files in partials directory

## Refactor postRegister function to be async and added global errorHandler

## Add login/logout routes

## Update routes for posts and renamed routes to follow RESTful approach

## Add geolocation feature using Mapbox API

## Update Post Model and Controller

## Update Posts show view

## Upload images feature
* Create cloudinary account (or use existing)
* Install cloudinary and multer
* Cloudinary used to store images in cloud, and multer used to deal with multi form data and add additional images
* Configure multer for upload in routes file (maybe add image filter)
* Require and confiure cloudinary (api key, secret, etc)
* Update Post route
* Added the ability to upload multiple images (up to 4) per post

## Add favicon

## Configure EJS layouts to be served for different webpages

## Add flash messages
* Update pre-route middleware to check for error or success on session
* Update post-route error handling middleware to console.log full error and then redirect
* Create partial for flash messages and include it in layouts
* Write some success messages and throw some error to test it out

## Add Stripe payment (legacy method) for show page
* Add shopping cart with stripe payment option

## Downloaded curl to use to test routes for login 
* curl is a command line tool thats similar to what postman does
* e.g: curl -d "username=test&password=test" -X POST http://localhost:3000/register

## Add Google Oauth
* Configure credentials from google developers console
* Add server and client sides communication
* Save user profile to MongoDB

## User can submit review for a post
* A review can be edited/deleted after it is submitted by user
* A review can only be edited/deleted by the review's author
* Restrict user to one review per post

## Delete all reviews associated with the removal of a post 

## Add 5 star rating widget to reviews
* User can select how many star rating to give on review forms (edit/new)
* User can update rating after submission
* Add a button that enables the user to clear their rating and give zero stars


# Add pagination to limit number of posts displayed on page
Using faker npm
Add page numbers

# Add Seeds file to quickly add posts to DB
Using mongoose-paginate npm

# Add average rating to Post

# Refactor multer and cloudinary code
No longer storing temporary buffer files for uploaded images in our local /uploads directory
Cloudinary will store those files

# Updated local user authentication/authorization
Add isLoggedIn middleware check

# Add is isAuthor middleware
Check if user is author of post prior to letting them edit/delete post
Hide edit/delete button/routes for invalid user

# Add package: npm-check-updates 
Run ncu command to show dependencies that need to be updated

# Remove bodyParser as its no longer needed with express v.4.16.0+

# User can update profile
User can change his username/password via profile page

# Detect location of website's users
Geolocation API 
Drawbacks: It only works on secure servers (https). It is not supported on Internet Explorer 10 and below
IP Geolocation API
Google Maps Reverse Geocoding API to convert coordinates to physical address location

# To do:


