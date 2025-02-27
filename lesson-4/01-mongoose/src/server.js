import 'dotenv/config';

import app from './app.js';
import { initDatabaseConnection } from './db.js';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  try {
    await initDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
