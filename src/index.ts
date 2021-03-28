
import express from 'express'
import http from 'http'
import index from './routes/index'
import userRoutes from './routes/userRoutes'

const PORT = process.env.PORT || 5000;
const app = express()

import "./database/connection";
app.use(express.json());
app.use(express.urlencoded());
app.use(index, userRoutes)


const expressServer = http.createServer(app);

expressServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));

