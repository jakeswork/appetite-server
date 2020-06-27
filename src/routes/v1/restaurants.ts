import { Router } from 'express';

import Restaurant from '../../models/Restaurant';

const router = Router();

router.get('/city', async (req, res) => {
  const { cityId, cuisines } = req.query

  if (!cityId) {
    res.status(400)

    return res.send('Please provide a city id.')
  }

  const response = await Restaurant.findManyByCityId(cityId.toString(), cuisines.toString());

  return res.send(response)
});

export default router;
