import express from 'express';
import { sendMessage } from '../modules/rabbitMq';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('I am alive');
});
router.post('/teste', (req, res) => {
  sendMessage('hello', { daora: 'man' });
});

export default router;
