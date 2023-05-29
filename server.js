const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Import API routes from another file
const apiRoutes = require('./routes/api.Routes');

// Import HTML routes from another file
const htmlRoutes = require('./routes/htmlRoutes');

// Middleware for parsing application/json and urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files in the "public" directory
app.use(express.static("public"));

// For any incoming requests with a URL that starts with "/api", use the API routes.
app.use('/api', apiRoutes);

// For any incoming requests with a URL that does not start with "/api", use the HTML routes.
app.use('/', htmlRoutes);

// Start the server on the specified port (3001)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



