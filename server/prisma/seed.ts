import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { SEED_ADMIN, SEED_SOFTWARE_SYSTEMS } from '../src/data/seedData.js';

dotenv.config();

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('🌱 Starting Enterprise Software Registry database seed...');

  // Hash demo admin password
  const passwordHash = await bcrypt.hash(SEED_ADMIN.password, 10);

  // Upsert demo Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: SEED_ADMIN.email },
    update: {
      name: SEED_ADMIN.name,
      passwordHash,
      role: SEED_ADMIN.role,
      department: SEED_ADMIN.department,
    },
    create: {
      email: SEED_ADMIN.email,
      name: SEED_ADMIN.name,
      passwordHash,
      role: SEED_ADMIN.role,
      department: SEED_ADMIN.department,
    },
  });

  console.log(`✅ Admin user seeded: ${adminUser.email} (${adminUser.name})`);

  // Seed software systems
  let createdCount = 0;
  let updatedCount = 0;

  for (const system of SEED_SOFTWARE_SYSTEMS) {
    const existing = await prisma.softwareSystem.findUnique({
      where: { systemId: system.systemId },
    });

    if (existing) {
      await prisma.softwareSystem.update({
        where: { systemId: system.systemId },
        data: {
          ...system,
          createdBy: adminUser.id,
        },
      });
      updatedCount++;
    } else {
      await prisma.softwareSystem.create({
        data: {
          ...system,
          createdBy: adminUser.id,
        },
      });
      createdCount++;
    }
  }

  console.log(`✅ Seeded ${createdCount} new and ${updatedCount} updated software systems.`);
  console.log('🎉 Enterprise Software Registry database seeding completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  runSeed()
    .catch((error) => {
      console.error('❌ Error during database seeding:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
