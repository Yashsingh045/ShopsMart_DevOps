const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

class WishlistService {
  async getWishlist(userId) {
    return prisma.wishlistFolder.findMany({
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

  async createFolder(userId, name) {
    const existingFolder = await prisma.wishlistFolder.findUnique({
      where: {
        userId_name: { userId, name }
      }
    });

    if (existingFolder) {
      throw new Error('Folder already exists');
    }

    return prisma.wishlistFolder.create({
      data: {
        userId,
        name
      }
    });
  }

  async deleteFolder(userId, folderId) {
    const folder = await prisma.wishlistFolder.findUnique({
      where: { id: folderId }
    });

    if (!folder || folder.userId !== userId) {
      throw new Error('Folder not found');
    }

    if (folder.isDefault) {
      throw new Error('Cannot delete default folder');
    }

    // Prisma handles cascading deletes if configured, but let's be explicit if needed.
    // In our schema, we didn't specify onDelete: Cascade, so we delete items first.
    await prisma.wishlistItem.deleteMany({
      where: { folderId }
    });

    return prisma.wishlistFolder.delete({
      where: { id: folderId }
    });
  }

  async addItemToFolder(userId, folderId, productId) {
    const folder = await prisma.wishlistFolder.findUnique({
      where: { id: folderId }
    });

    if (!folder || folder.userId !== userId) {
      throw new Error('Folder not found');
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        folderId_productId: { folderId, productId }
      }
    });

    if (existingItem) {
      return existingItem;
    }

    return prisma.wishlistItem.create({
      data: {
        folderId,
        productId
      }
    });
  }

  async removeItemFromFolder(userId, folderId, productId) {
    const folder = await prisma.wishlistFolder.findUnique({
      where: { id: folderId }
    });

    if (!folder || folder.userId !== userId) {
      throw new Error('Folder not found');
    }

    return prisma.wishlistItem.delete({
      where: {
        folderId_productId: { folderId, productId }
      }
    });
  }

  async moveItem(userId, fromFolderId, toFolderId, productId) {
    const [fromFolder, toFolder] = await Promise.all([
      prisma.wishlistFolder.findUnique({ where: { id: fromFolderId } }),
      prisma.wishlistFolder.findUnique({ where: { id: toFolderId } })
    ]);

    if (!fromFolder || fromFolder.userId !== userId || !toFolder || toFolder.userId !== userId) {
      throw new Error('Folder not found');
    }

    return prisma.$transaction([
      prisma.wishlistItem.delete({
        where: { folderId_productId: { folderId: fromFolderId, productId } }
      }),
      prisma.wishlistItem.create({
        data: { folderId: toFolderId, productId }
      })
    ]);
  }
}

module.exports = new WishlistService();
