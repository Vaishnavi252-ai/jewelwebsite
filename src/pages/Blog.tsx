import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { getBlogPosts } from '../services/blog';
import { LOCAL_IMGS } from '../lib/utils';

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getBlogPosts,
  });

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  const categories = ['Jewelry Tips', 'Trends', 'Gemstones', 'Care Guide', 'Weddings'];

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
            <button style={{ backgroundColor: '#B9375E', color: '#fff' }}
              className="px-4 py-2 rounded-full text-xs font-medium">All</button>
            {categories.map(cat => (
              <button key={cat}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="px-4 py-2 rounded-full text-xs font-medium hover:border-[#B9375E] hover:text-[#B9375E] transition-colors">
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
          <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-8">Recent Articles</h2>
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
