import express from 'express';
import http from 'http';
import index from './routes/index';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import './database/connection';
import authRoutes from './routes/AuthRoutes';
import userFollowersRoutes from './routes/UserFollowers';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [
      /* 'https://social-media-sandy.vercel.app', */
      'http://localhost:3000',
    ],
  })
);
app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(index, userRoutes, authRoutes, userFollowersRoutes);

const expressServer = http.createServer(app);

expressServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
