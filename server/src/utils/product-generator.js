const generateProducts = (categories) => {
  const products = [];
  const adjs = ['Essential', 'Premium', 'Classic', 'Modern', 'Urban', 'Cozy', 'Active', 'Sporty', 'Luxury', 'Minimalist'];
  const types = {
    'Clothes': ['T-Shirt', 'Jeans', 'Jacket', 'Hoodie', 'Sweater', 'Dress', 'Shorts', 'Shirt'],
    'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Running Shoes', 'Formal Shoes', 'Heels'],
    'Accessories': ['Watch', 'Belt', 'Wallet', 'Backpack', 'Sunglasses', 'Cap', 'Scarf', 'Gloves']
  };

  const categoryImages = {
    'Clothes': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'
    ],
    'Shoes': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'
    ],
    'Accessories': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1509100194014-d49809396daa?w=800&q=80',
      'https://images.unsplash.com/photo-1511499767010-a588a512d74a?w=800&q=80'
    ]
  };

  for (let i = 1; i <= 1000; i++) {
    const categoryName = Object.keys(types)[Math.floor(Math.random() * 3)];
    const typeList = types[categoryName];
    const adj = adjs[Math.floor(Math.random() * adjs.length)];
    const type = typeList[Math.floor(Math.random() * typeList.length)];
    
    products.push({
      name: `${adj} ${type} ${i}`,
      description: `High-quality ${type.toLowerCase()} for daily use. Part of our ${adj.toLowerCase()} collection.`,
      price: parseFloat((Math.random() * (200 - 10) + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 100) + 10,
      categoryName: categoryName,
      images: categoryImages[categoryName]
    });
  }
  return products;
};

module.exports = { generateProducts };
