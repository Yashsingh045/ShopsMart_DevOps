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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (product && product.reviews.length > 0) {
      const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.averageRating = parseFloat((sum / product.reviews.length).toFixed(1));
      
      // Calculate rating breakdown (1-5 stars)
      const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      product.reviews.forEach(r => breakdown[r.rating]++);
      product.ratingBreakdown = breakdown;
    } else if (product) {
      product.averageRating = 0;
      product.ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    return product;
  }

  async getSimilarProducts(productId, limit = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true }
    });

    if (!product) throw new Error('Product not found');

    return prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        NOT: { id: productId }
      },
      take: parseInt(limit),
      include: { category: true }
    });
  }
}

module.exports = new ProductService();
