import { Router } from 'express'

import City from '../../models/City';

const router = Router();

router.get('/', async (req, res) => {
  const { searchQuery } = req.query

  if (!searchQuery) {
    res.status(400)

    return res.send('Please provide a search query.')
  }

  const suggestions = await City.findManyByQuery(searchQuery.toString())

  return res.send(suggestions)
});

export default router;
