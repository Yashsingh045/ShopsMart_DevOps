const generateProducts = (categories) => {
  const products = [];
  const adjs = ['Essential', 'Premium', 'Classic', 'Modern', 'Urban', 'Cozy', 'Active', 'Sporty', 'Luxury', 'Minimalist'];
  const types = {
    'Clothes': ['T-Shirt', 'Jeans', 'Jacket', 'Hoodie', 'Sweater', 'Dress', 'Shorts', 'Shirt'],
    'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Running Shoes', 'Formal Shoes', 'Heels'],
    'Accessories': ['Watch', 'Belt', 'Wallet', 'Backpack', 'Sunglasses', 'Cap', 'Scarf', 'Gloves']
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
      categoryName: categoryName
    });
  }
  return products;
};

module.exports = { generateProducts };
