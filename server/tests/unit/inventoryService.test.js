const { PrismaClient } = require('../../src/generated/prisma');
const inventoryService = require('../../src/services/inventoryService');

// Mock the entire PrismaClient module
jest.mock('../../src/generated/prisma', () => {
  const mPrisma = {
    product: {
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('InventoryService Unit Tests', () => {
  let prisma;

  beforeEach(() => {
    // Access the mocked instance
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('getLowStockProducts', () => {
    it('should query products with stock less than specified threshold', async () => {
      const mockResult = [{ id: '1', name: 'Product A', stock: 5 }];
      prisma.product.findMany.mockResolvedValue(mockResult);

      const result = await inventoryService.getLowStockProducts(10);

      expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { stock: { lt: 10 } }
      }));
      expect(result).toEqual(mockResult);
    });

    it('should use default threshold of 10 if none provided', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      await inventoryService.getLowStockProducts();
      expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { stock: { lt: 10 } }
      }));
    });
  });

  describe('updateStock', () => {
    it('should update product stock correctly', async () => {
      const productId = 'p1';
      const newStock = 50;
      prisma.product.update.mockResolvedValue({ id: productId, stock: newStock });

      const result = await inventoryService.updateStock(productId, newStock);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { stock: newStock }
      });
      expect(result.stock).toBe(50);
    });
  });

  describe('getStockLevel', () => {
    it('should return stock info for a valid product', async () => {
      const productId = 'p1';
      const mockProduct = { name: 'Test Product', stock: 20 };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await inventoryService.getStockLevel(productId);

      expect(prisma.product.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: productId }
      }));
      expect(result).toEqual(mockProduct);
    });

    it('should throw error if product is not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(inventoryService.getStockLevel('invalid')).rejects.toThrow('Product not found');
    });
  });
});
