// controllers/searchController.js
const {search} = require('../services/searchService');
const asyncHandler = require('express-async-handler');
const searchController = asyncHandler(async (req, res) => {
  try {
    const searchTerm = req.params.query; // Assuming the search query is passed as a query parameter 'q'
    console.log(searchTerm)
    // Call the search service to perform the search
    const searchResults = await search(searchTerm);

    // Send the search results back to the frontend
    res.json({ results: searchResults });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'An error occurred during search.' });
  }
});

module.exports=searchController;