import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env, validateEnvironment } from "./config/env.js";

async function startServer() {
  validateEnvironment();
  await connectDatabase();
  app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
}

startServer().catch((error) => {
  console.error("Unable to start API", error);
  process.exit(1);
});
