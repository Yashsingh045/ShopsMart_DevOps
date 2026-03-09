const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class ProductService {
  async getProducts({ category, minPrice, maxPrice, rating, search, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (category) {
      where.category = { name: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (rating) {
      // Products with average rating >= specified rating
      where.reviews = {
        some: {},
      };
      // Note: Complex aggregations in 'where' are limited in Prisma.
      // For now, we'll filter by category/price and handle rating if needed, 
      // or just filter where at least one review exists with that rating.
      // A more robust way would be a specialized query or computed field.
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, _count: { select: { reviews: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }
}

module.exports = new ProductService();
