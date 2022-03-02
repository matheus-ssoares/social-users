import express from 'express';
import { sendMessage } from '../modules/rabbitMq';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('I am alive');
});

export default router;
