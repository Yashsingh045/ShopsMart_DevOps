const { generateProducts } = require('../../src/utils/product-generator');

describe('Product Generator Unit Tests', () => {
    it('should generate exactly 1000 products by default', () => {
        const products = generateProducts();
        expect(products).toHaveLength(1000);
    });

    it('should generate products with correct structure', () => {
        const products = generateProducts();
        const product = products[0];

        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('categoryName');
        expect(product).toHaveProperty('images');
        expect(Array.isArray(product.images)).toBe(true);
    });

    it('should generate valid category names', () => {
        const products = generateProducts();
        const validCategories = ['Clothes', 'Shoes', 'Accessories'];
        
        products.forEach(p => {
            expect(validCategories).toContain(p.categoryName);
        });
    });

    it('should generate prices within 10 and 200', () => {
        const products = generateProducts();
        products.forEach(p => {
            expect(p.price).toBeGreaterThanOrEqual(10);
            expect(p.price).toBeLessThanOrEqual(200);
        });
    });

    it('should generate stock within 10 and 110', () => {
        const products = generateProducts();
        products.forEach(p => {
            expect(p.stock).toBeGreaterThanOrEqual(10);
            expect(p.stock).toBeLessThanOrEqual(110);
        });
    });
});
