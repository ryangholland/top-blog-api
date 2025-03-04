const app = require("./app");
const prisma = require("./db/prisma");

const PORT = process.env.PORT || 5000;

const handleShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing Prisma connection...`);
  await prisma.$disconnect();
  process.exit(0);
};

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  // Graceful shutdown handlers
  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);
  process.on("uncaughtException", handleShutdown);
  process.on("unhandledRejection", handleShutdown);
};

module.exports = startServer;
