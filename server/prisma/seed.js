const { PrismaClient } = require('../src/generated/prisma');
const { generateProducts } = require('../src/utils/product-generator');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Categories
  const categoryNames = ['Clothes', 'Shoes', 'Accessories'];
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  const categories = await prisma.category.findMany();
  const categoryIdMap = categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.id }), {});
  console.log('Categories seeded.');

  // 2. Initial Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopsmart.com' },
    update: {},
    create: {
      email: 'admin@shopsmart.com',
      password: 'adminpassword',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@shopsmart.com' },
    update: {},
    create: {
      email: 'user@shopsmart.com',
      password: 'userpassword',
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('Initial users seeded.');

  // 3. Products (Large Dataset)
  console.log('Generating 1000 products...');
  const productData = generateProducts(categoryNames);
  
  const productsToInsert = productData.map(p => ({
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    categoryId: categoryIdMap[p.categoryName],
    userId: admin.id
  }));

  // Chunking for large insert
  for (let i = 0; i < productsToInsert.length; i += 100) {
    const chunk = productsToInsert.slice(i, i + 100);
    // Note: createMany is supported on Postgres
    await prisma.product.createMany({
      data: chunk,
      skipDuplicates: true
    });
  }
  console.log('1000 products seeded.');

  // 4. Reviews
  console.log('Seeding reviews...');
  const allProducts = await prisma.product.findMany({ take: 50, select: { id: true } });
  for (const product of allProducts) {
    const reviewCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < reviewCount; j++) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: testUser.id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: 'Great product! Highly recommend.'
        }
      });
    }
  }
  console.log('Reviews seeded for sample products.');

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
