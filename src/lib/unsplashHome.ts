export type UnsplashPhoto = { src: string; alt: string };

// Using fixed Unsplash image URLs (no API key required).
// Source: Unsplash (replace the IDs/queries as needed for your preferred photos).
export const homeHeroBackground: UnsplashPhoto = {
  // Jewelry product / luxury background vibe
  src: 'https://media.istockphoto.com/id/2188866824/photo/luxurious-diamond-rings-and-golden-hand-sculpture-showcasing-floating-jewelry-against-a.jpg?s=2048x2048&w=is&k=20&c=n6Vm0kpkql0r7nZ3ekcXPIfivLHEezBTLcN4grQ9kNU=',
  alt: 'Luxury jewelry background',
};

export const homeJewelleryCardPhotos: UnsplashPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Gold ring',
  },
  {
    src: 'https://images.unsplash.com/photo-1705326454924-f6777522b030?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Necklaces',
  },
  {
    src: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Earrings',
  },
  {
    src: 'https://images.unsplash.com/photo-1586878341523-7acb55eb8c12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJyYWNlbGV0cyUyMGpld2Vscnl8ZW58MHx8MHx8fDA%3D',
    alt: 'Bracelets and accessories',
  },
];

