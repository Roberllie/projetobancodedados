import { AppDataSource } from './infra/database/typeorm.config';
import { app } from './infra/http/app';

const PORT = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to database', err);
  });
