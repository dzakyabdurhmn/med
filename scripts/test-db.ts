import { prisma } from "../src/db.js";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("SUCCESS: Database connection established!");
    const count = await prisma.user.count();
    console.log("User count in DB:", count);
  } catch (err: any) {
    console.error("FAILED to connect to DB:", err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
