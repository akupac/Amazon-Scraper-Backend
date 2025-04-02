import express from 'express';
import getSearchResults from '../controllers/controller.js'

const router = express.Router();

router.use(express.json());
router.get('/scrape', getSearchResults);

export default router;
