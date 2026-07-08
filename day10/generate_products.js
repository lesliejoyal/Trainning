import fs from 'fs';

const categories = [
  { name: 'Originals', keyword: 'fashion,sneakers', gender: 'Originals' },
  { name: 'Football', keyword: 'football,soccer', gender: 'Men Performance' },
  { name: 'Cricket', keyword: 'cricket,sport', gender: 'Men Cricket' },
  { name: 'Basketball', keyword: 'basketball,shoes', gender: 'Men Basketball' },
  { name: 'Tennis', keyword: 'tennis,racket', gender: 'Tennis Equipment' },
  { name: 'Gym', keyword: 'gym,fitness', gender: 'Accessories' }
];

const tags = ['NEW', 'SALE', 'BEST SELLER', 'APP EXCLUSIVE', 'HOT', null, null, null];
const promos = ['Buy 2 get 50% off', 'Extra 10% off in app', '', '', '', ''];
const colors = ['1 colour', '2 colours', '3 colours', '4 colours', '5 colours', ''];

const products = [];
let globalId = 1;

categories.forEach(cat => {
  for (let i = 1; i <= 25; i++) {
    const isDiscounted = Math.random() > 0.7;
    const basePrice = Math.floor(Math.random() * 15000) + 2000;
    const originalPrice = isDiscounted ? Math.floor(basePrice * 1.3) : null;
    const discountPercentage = isDiscounted ? `-${Math.floor(Math.random() * 30) + 10}%` : null;
    
    products.push({
      id: globalId,
      name: `${cat.name.toUpperCase()} ELITE GEAR V${i}`,
      category: cat.name,
      price: basePrice,
      originalPrice: originalPrice,
      discountPercentage: discountPercentage,
      tag: tags[Math.floor(Math.random() * tags.length)],
      colorsCount: colors[Math.floor(Math.random() * colors.length)],
      promoText: promos[Math.floor(Math.random() * promos.length)],
      genderCategory: cat.gender,
      imageUrl: `https://loremflickr.com/800/800/${cat.keyword}?lock=${globalId}`,
      description: `Premium quality ${cat.name.toLowerCase()} equipment. Unique item #${globalId}.`
    });
    globalId++;
  }
});

const fileContent = `// AUTO-GENERATED: 150 unique products\n\nexport const initialProducts = ${JSON.stringify(products, null, 2)};\n`;

fs.writeFileSync('./src/data/products.js', fileContent);
console.log(`Successfully generated ${products.length} products to src/data/products.js`);
