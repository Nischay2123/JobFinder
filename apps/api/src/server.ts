import { app } from './app';
import { config } from './config';

const port = config.PORT;

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
