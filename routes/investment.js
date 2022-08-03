const router = require('express').Router();
const InvestModel = require('../models/investment');

router.post('/', async () => {
  const {} = req.body;
  const investment = await InvestModel.create();
});

module.exports = router;
