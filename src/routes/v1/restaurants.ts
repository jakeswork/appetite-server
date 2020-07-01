import { Router } from 'express';

import Restaurant from '../../models/Restaurant';

const router = Router();

router.get('/search', async (req, res) => {
  const {
    cityId,
    cuisines = '',
    searchQuery = '',
    paginationStart = 0,
  } = req.query

  if (!cityId) {
    res.status(400)

    return res.send('Please provide a city id.')
  }

  const response = await Restaurant.findMany(
    cityId.toString(),
    cuisines.toString(),
    searchQuery.toString(),
    Number(paginationStart),
  );

  return res.send(response)
});

export default router;
