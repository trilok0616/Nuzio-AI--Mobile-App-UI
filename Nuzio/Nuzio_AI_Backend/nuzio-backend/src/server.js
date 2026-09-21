require("dotenv").config();
const app = require("./app");
const { connectDatabase } = require("./config/db");

const PORT = Number(process.env.PORT || 5000);

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Nuzio API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start Nuzio API:", error);
  process.exit(1);
});
