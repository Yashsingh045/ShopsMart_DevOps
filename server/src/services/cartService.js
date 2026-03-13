const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class CartService {
  async getCart(userId) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addToCart(userId, productId, quantity = 1) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    }

    return prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      }
    });
  }

  async updateQuantity(userId, cartItemId, quantity) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      return prisma.cartItem.delete({
        where: { id: cartItemId }
      });
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  }

  async removeFromCart(userId, cartItemId) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new Error('Cart item not found');
    }

    return prisma.cartItem.delete({
      where: { id: cartItemId }
    });
  }

  async clearCart(userId) {
    return prisma.cartItem.deleteMany({
      where: { userId }
    });
  }
}

module.exports = new CartService();
