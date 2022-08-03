require('dotenv').config();
require('express-async-errors');
const express = require('express');
const router = express.Router();
const connectDb = require('./db/connect');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const InvestModel = require('./models/investment');
const investmentRoute = require('./routes/investment');
const interval = require('interval-promise');

const app = express();
const haltOnTImedOut = (req, res, next) => {
  if (!req.timedout) next();
};
app.set('trust proxy', 1);
// MIDDLEWARE
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(
  express.json({
    limit: '50mb',
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
);
app.use(xss());
app.use(haltOnTImedOut);

// app.patch('/api/micros', async (req, res) => {
//   const {} = req.body;
//   // const investment = await InvestModel.create();
//   console.log('test');
// });

interval(async () => {
  const investments = await InvestModel.find();
  investments.forEach(async (i) => {
    const newIncrementAmount =
      i.incrementAmount + i.property.expectedIncome / 100;
    const updateInvestment = await InvestModel.findOneAndUpdate(
      { _id: i._id },
      { incrementAmount: newIncrementAmount, incrementedAt: Date.now() },
      { new: true }
    );
    updateInvestment;
    console.log(`${i._id} increment's is now ${i.incrementAmount}`);
  });
}, 604800000);
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(
        `Microservice for lemox is running on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

start();
