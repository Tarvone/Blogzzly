import express from 'express';
const app = express();
import cors from 'cors'
import { frontendDev, frontendProd, nodeEnv, port } from './config.js'
import { router } from './routes.js';

if (!frontendDev || !frontendProd || !nodeEnv || !port) {
  console.error('Environments Variables not set!!!');
  process.exit(1);
}

const corsConfig = {
  origin: nodeEnv === 'development' ? `${frontendDev}:${port}` : frontendProd,
  optionsSuccessStatus: 200,
}

app.use(cors(corsConfig));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: "Proxy is alive!" });
});
app.use('/api/blogs', router);

if (nodeEnv === 'development') {
  app.listen(port, () => {
    console.log(`Server started on ${frontendDev}${port}`)
  });
}

export default app;