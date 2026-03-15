const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class InventoryService {
  async getLowStockProducts(threshold = 10) {
    return prisma.product.findMany({
      where: {
        stock: {
          lt: threshold
        }
      },
      include: {
        category: true
      },
      orderBy: {
        stock: 'asc'
      }
    });
  }

  async updateStock(productId, newStock) {
    return prisma.product.update({
      where: { id: productId },
      data: { stock: newStock }
    });
  }

  async getStockLevel(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true }
    });
    if (!product) throw new Error('Product not found');
    return product;
  }
}

module.exports = new InventoryService();
