import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server]: Running at http://localhost:${PORT}`);
    console.log(`[Swagger]: API Docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
