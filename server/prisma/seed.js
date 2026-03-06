const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Categories
  const categories = [
    { name: 'Clothes' },
    { name: 'Shoes' },
    { name: 'Accessories' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log('Categories seeded.');

  // 2. Initial Admin and Test User
  // Note: Password hashing will be added in Phase 2, using plain text for now as per minimal F4
  const users = [
    {
      email: 'admin@shopsmart.com',
      password: 'adminpassword', // To be hashed later
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'user@shopsmart.com',
      password: 'userpassword',
      name: 'Test User',
      role: 'USER',
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Initial users seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
