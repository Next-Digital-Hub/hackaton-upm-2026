import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@meteoalert.com" },
    update: {},
    create: {
      email: "admin@meteoalert.com",
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
      province: "Madrid",
      housingType: "HIGH_FLOOR",
      specialNeeds: [],
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Create test citizen user
  const citizenPassword = await bcrypt.hash("citizen123", 12);
  const citizen = await prisma.user.upsert({
    where: { email: "ciudadano@test.com" },
    update: {},
    create: {
      email: "ciudadano@test.com",
      name: "Ciudadano Test",
      password: citizenPassword,
      role: "CITIZEN",
      province: "Valencia",
      housingType: "GROUND_FLOOR",
      specialNeeds: ["PETS"],
    },
  });
  console.log(`Citizen user created: ${citizen.email}`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
