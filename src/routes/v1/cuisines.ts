import { Router } from 'express';

import Cuisine from '../../models/Cuisine';

const router = Router();

router.get('/', async (req, res) => {
  const { cityId } = req.query

  if (!cityId) {
    res.status(400)

    return res.send('Please provide a city id.')
  }

  const cuisines = await Cuisine.findManyByCityId(cityId.toString())

  return res.send(cuisines)
});

export default router;
