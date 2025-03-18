import 'dotenv/config';

import app from './app.js';
import { initDatabaseConnection } from './db.js';

import { getEnvVar } from './utils/getEnvVar.js';

const PORT = getEnvVar('PORT', 9090);

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
