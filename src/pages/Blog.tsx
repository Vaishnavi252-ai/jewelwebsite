import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

const LOCAL_IMGS = [
  'https://images.unsplash.com/photo-1492714485642-dd6df6baafa2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1687253946687-a3713aa25b2f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1638734205377-f21045bf6ebe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514612497953-05d1e5e171fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512217358397-b68c2bc84682?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1643168661861-ec693dcbc016?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=1200&q=80',
];

const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Jewelry Trends Taking Over 2026',
    category: 'Trends',
    excerpt: "From sculptural gold cuffs to colored gemstone stacks, here's what's dominating jewelry boxes this year.",
    content: "2026 is the year jewelry gets bolder and more personal. Sculptural, asymmetric gold pieces are replacing dainty minimalism, while colored gemstones like sapphire and citrine are taking the spotlight away from classic diamonds. Layered chains, mismatched earrings, and convertible pieces that transition from day to night are also having a major moment. We break down the five trends worth investing in, and the ones you can safely skip.",
    image_url: 'https://images.unsplash.com/photo-1687253946687-a3713aa25b2f?auto=format&fit=crop&w=1600&q=80',
    created_at: '2026-06-18T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Gold, Silver, or Rose Gold? The Art of Mixing Metals',
    category: 'Jewelry Tips',
    excerpt: "The old rule of matching your metals is officially outdated. Here's how to mix them like a stylist.",
    content: "Gone are the days when wearing gold and silver together was a fashion faux pas. The key to mixing metals confidently is choosing one dominant tone and using the second as an accent, balancing warm and cool finishes, and letting your skin tone guide the ratio. We walk through easy combinations for rings, stacked bracelets, and layered necklaces that look intentional rather than mismatched.",
    image_url: 'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-06-14T09:00:00.000Z',
  },
  {
    id: 3,
    title: 'Birthstones Decoded: What Your Gemstone Says About You',
    category: 'Gemstones',
    excerpt: 'Every month has a stone, and every stone has a story. Find out what yours represents.',
    content: "Birthstones have carried meaning for centuries, from the fiery passion of a January garnet to the calming clarity of a December turquoise. Beyond the symbolism, each gemstone also has its own hardness, care needs, and ideal settings. This guide walks through all twelve birthstones, their histories, and tips for choosing a piece that feels personal rather than generic.",
    image_url: 'https://images.unsplash.com/photo-1514612497953-05d1e5e171fa?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-06-10T09:00:00.000Z',
  },
  {
    id: 4,
    title: 'The Right Way to Clean and Store Your Gold Jewelry',
    category: 'Care Guide',
    excerpt: "Skip the harsh chemicals. Here's the gentle routine that keeps gold looking new for years.",
    content: "Gold is durable, but it isn't indestructible. Lotion, sweat, and chlorine can dull its shine over time, while the wrong cleaning method can scratch delicate settings. We cover the warm-water-and-mild-soap method jewelers actually recommend, how often you should really be cleaning your pieces, and the simple storage habit that prevents tangling and tarnish.",
    image_url: 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-06-06T09:00:00.000Z',
  },
  {
    id: 5,
    title: 'How to Choose the Perfect Wedding Bands',
    category: 'Weddings',
    excerpt: 'Matching, mismatched, stacked, or plain — your wedding band should reflect how you actually live.',
    content: "Your wedding band gets worn every single day, which makes comfort just as important as style. We walk through choosing the right metal for your lifestyle, deciding between a matching set or two distinct bands, and why trying on bands toward the end of the day (when fingers are slightly swollen) gives you the most accurate fit.",
    image_url: 'https://images.unsplash.com/photo-1492714485642-dd6df6baafa2?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-06-02T09:00:00.000Z',
  },
  {
    id: 6,
    title: 'Layering 101: The Art of Stacking Necklaces & Rings',
    category: 'Trends',
    excerpt: "Layering isn't random — there's a formula. Here's how to stack jewelry without it looking cluttered.",
    content: "The secret to an effortless layered look is varying length, texture, and scale rather than piling on similar pieces. Start with a choker-length chain, add a mid-length pendant, and finish with a longer statement piece for necklaces. For rings, mix a slim band with one textured piece and one with a small stone to keep the eye moving without overwhelming the hand.",
    image_url: 'https://images.unsplash.com/photo-1643168661861-ec693dcbc016?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-05-29T09:00:00.000Z',
  },
  {
    id: 7,
    title: 'Diamond vs Moissanite: Which Stone Is Right for You',
    category: 'Gemstones',
    excerpt: "Same sparkle, very different price tags. Here's an honest comparison before you decide.",
    content: "Moissanite has become a popular diamond alternative thanks to its similar brilliance at a fraction of the cost. We compare the two on hardness, fire and sparkle, durability, and long-term value, so you can decide what matters more for your budget and the way you'll actually wear the piece day to day.",
    image_url: 'https://images.unsplash.com/photo-1638734205377-f21045bf6ebe?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-05-25T09:00:00.000Z',
  },
  {
    id: 8,
    title: '10 Everyday Habits That Keep Your Jewelry Sparkling',
    category: 'Care Guide',
    excerpt: 'Small daily habits make a bigger difference than the occasional deep clean.',
    content: "The biggest threat to your jewelry isn't a one-time accident, it's everyday exposure to perfume, lotion, and humidity. Putting jewelry on last when getting ready, taking rings off before washing dishes, and storing pieces separately so they don't scratch each other are simple habits that add years to their shine. Here are ten more worth building into your routine.",
    image_url: 'https://images.unsplash.com/photo-1602527428055-a2526fabdc9f?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-05-21T09:00:00.000Z',
  },
  {
    id: 9,
    title: 'Picking the Engagement Ring of Your Dreams',
    category: 'Weddings',
    excerpt: 'Cut, carat, clarity, color — and the one factor most guides forget to mention.',
    content: "Beyond the classic four Cs, the ring's setting and how it suits your daily routine matter just as much as the stone itself. We break down which cuts wear best for active hands, how to balance carat weight with budget, and questions worth asking before you say yes to a setting.",
    image_url: 'https://images.unsplash.com/photo-1512217358397-b68c2bc84682?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-05-17T09:00:00.000Z',
  },
  {
    id: 10,
    title: 'Minimalist Jewelry: Why Less Is the New Luxury',
    category: 'Jewelry Tips',
    excerpt: 'One perfect piece is having a bigger moment than a handful of trendy ones.',
    content: "Minimalist jewelry has shifted from a budget alternative to a deliberate style choice, with quality over quantity as its core idea. We look at how to build a small, versatile collection of pieces that work for every outfit, why investing in fewer, better items pays off, and how to choose pieces that won't feel dated in a few years.",
    image_url: 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-05-13T09:00:00.000Z',
  },
];

// Simulated API call — swap for a real fetch/CMS call whenever you're ready.
async function getBlogPosts() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return BLOG_POSTS;
}

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getBlogPosts,
  });

  const categories = ['Jewelry Tips', 'Trends', 'Gemstones', 'Care Guide', 'Weddings'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts =
    selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1);

  const trendingArticles = [
    {
      title: '2026 Jewelry Trends You Must Know',
      source: 'Google News',
      url: 'https://www.google.com/search?q=jewelry+trends+2026&tbm=nws',
    },
    {
      title: 'How to Take Care of Gold & Diamond Jewelry',
      source: 'Google Search',
      url: 'https://www.google.com/search?q=jewelry+care+tips',
    },
    {
      title: 'Latest Engagement Ring Styles Trending Worldwide',
      source: 'Google News',
      url: 'https://www.google.com/search?q=engagement+ring+trends+2026&tbm=nws',
    },
  ];

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="h-80 bg-[#F7EAF0] rounded-2xl" />
              <div className="space-y-4"><div className="h-6 bg-[#F7EAF0] rounded w-3/4" /><div className="h-4 bg-[#F7EAF0] rounded" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 style={{ color: '#2B2B2B' }} className="text-4xl font-bold mb-2">The VILAVIE Journal</h1>
            <p style={{ color: '#6B6B6B' }} className="text-sm">Stories, tips, and inspiration for jewelry lovers</p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory('All')}
              style={
                selectedCategory === 'All'
                  ? { backgroundColor: '#B9375E', color: '#fff' }
                  : { backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }
              }
              className="px-4 py-2 rounded-full text-xs font-medium hover:border-[#B9375E] hover:text-[#B9375E] transition-colors"
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={
                  selectedCategory === cat
                    ? { backgroundColor: '#B9375E', color: '#fff' }
                    : { backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }
                }
                className="px-4 py-2 rounded-full text-xs font-medium hover:border-[#B9375E] hover:text-[#B9375E] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
              className="rounded-3xl overflow-hidden mb-12 lg:grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto">
                <img src={featuredPost.image_url || LOCAL_IMGS[0]} alt={featuredPost.title}
                  className="w-full h-full object-cover" />
              </div>
              <div className="p-6 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ backgroundColor: '#B9375E', color: '#fff' }} className="px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <span style={{ color: '#6B6B6B' }} className="flex items-center gap-1 text-xs">
                    <Calendar size={12} /> {new Date(featuredPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-3 hover:text-[#B9375E] transition-colors cursor-pointer">
                  {featuredPost.title}
                </h2>
                <p style={{ color: '#6B6B6B' }} className="text-sm leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.excerpt || featuredPost.content?.slice(0, 200)}
                </p>
                <button className="flex items-center gap-2 text-sm font-medium" style={{ color: '#B9375E' }}>
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-8">
            {selectedCategory === 'All' ? 'Recent Articles' : selectedCategory}
          </h2>
          {recentPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, i) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                  className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image_url || LOCAL_IMGS[i % LOCAL_IMGS.length]} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={12} style={{ color: '#B9375E' }} />
                      <span style={{ color: '#B9375E' }} className="text-xs font-medium">{post.category || 'General'}</span>
                    </div>
                    <h3 style={{ color: '#2B2B2B' }} className="font-bold mb-2 group-hover:text-[#B9375E] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p style={{ color: '#6B6B6B' }} className="text-sm mb-4 line-clamp-2">{post.excerpt || post.content?.slice(0, 100)}</p>
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#6B6B6B' }} className="text-xs flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <button style={{ color: '#B9375E' }} className="text-xs font-medium flex items-center gap-1 hover:underline">
                        Read More <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p style={{ color: '#6B6B6B' }} className="text-sm">No articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Searches */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6 lg:p-8">
            <h3 style={{ color: '#2B2B2B' }} className="text-lg font-bold mb-4">Trending Searches</h3>
            <div className="flex flex-wrap gap-3">
              {trendingArticles.map((item) => (
                <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="px-4 py-2 rounded-full text-xs font-medium hover:border-[#B9375E] hover:text-[#B9375E] transition-colors">
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F7EAF0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-xl mx-auto text-center">
            <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-6">Get the latest articles and jewelry tips delivered to your inbox.</p>
            <form className="flex gap-3">
              <input type="email" placeholder="Enter your email"
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
              <button type="submit"
                style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}