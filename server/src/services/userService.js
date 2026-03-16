const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class UserService {
  async getUserProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            wishlists: true
          }
        }
      }
    });

    if (!user) throw new Error('User not found');

    // Calculate total spent
    const orders = await prisma.order.findMany({
      where: { userId, status: 'DELIVERED' }, // Only delivered orders count towards total spent
      select: { total: true }
    });

    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

    return {
      ...user,
      totalSpent,
      stats: {
        totalOrders: user._count.orders,
        wishlistFolders: user._count.wishlists
      }
    };
  }

  async updateProfile(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }
}

module.exports = new UserService();
