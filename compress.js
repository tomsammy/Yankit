import sharp from 'sharp';

sharp('public/hero.jpeg')
  .webp({ quality: 75 })
  .toFile('public/hero.webp')
  .then(info => {
    console.log('✔ Compressed hero.jpeg to hero.webp:', info);
  })
  .catch(err => {
    console.error('✘ Compression error:', err);
  });
