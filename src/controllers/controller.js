import { searchProducts } from '../services/services.js';

/**
 * Controller responsible for handling GET requests to the /scrape endpoint.
 * Extracts an array of products from the HTML of an Amazon search results page.
 * 
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * 
 * @returns {Promise} A promise with the HTTP response.
**/
const getSearchResults = async (req, res) => {
  const keyword = req.query.keyword;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Nenhuma palavra chave foi inserida' });
  }

  const searchResults = await searchProducts(keyword);

  if (!searchResults || Object.keys(searchResults).length === 0) {
    return res.status(404).json({ error: 'Nenhum produto encontrado' });
    }
  else {
    return res.status(200).json(searchResults);
  }
}

export default getSearchResults;