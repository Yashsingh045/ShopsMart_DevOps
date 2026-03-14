const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class OrderService {
  async getOrders(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createOrder(userId) {
    // 1. Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // 2. Validate stock and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.product.name}`);
      }
      total += item.product.price * item.quantity;
    }

    // 3. Run transaction: Create Order, Items, Update Stock, and Clear Cart
    return prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING'
        }
      });

      // Create order items and update product stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return order;
    });
  }

  async getOrderById(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }

    return order;
  }
}

module.exports = new OrderService();
