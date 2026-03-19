import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, Search } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { cn } from '../lib/utils';

interface BlogViewProps {
  onBack: () => void;
  t: (key: string) => string;
  selectedPostId: number | null;
  onSelectPost: (id: number | null) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onBack, t, selectedPostId, onSelectPost }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => onSelectPost(null)}
            className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('landing.blog.backToList')}
          </button>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6 rounded-full">
              {selectedPost.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8 text-zinc-900 dark:text-white">
              {selectedPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-bold">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${selectedPost.author}`} alt={selectedPost.author} referrerPolicy="no-referrer" />
                </div>
                <span className="text-zinc-900 dark:text-white">{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {selectedPost.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {selectedPost.readTime}
              </div>
            </div>
          </div>

          <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-12 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 font-medium italic border-l-4 border-primary pl-6">
              {selectedPost.excerpt}
            </p>
            <div className="text-zinc-800 dark:text-zinc-300 leading-relaxed space-y-6 text-lg">
              {selectedPost.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p>
                As global trade continues to evolve, staying ahead requires more than just traditional logistics. It requires a partner who understands the intersection of technology, local market dynamics, and risk management. At Glob$ourcia, we are committed to providing our clients with the tools and expertise they need to thrive in this complex environment.
              </p>
              <p>
                Whether you are looking to diversify your supplier base, optimize your shipping routes, or leverage AI for better pricing, our team is here to support you. Contact us today to learn more about how we can help you build a more resilient and efficient supply chain.
              </p>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-2xl font-black mb-8 text-zinc-900 dark:text-white">Related Articles</h4>
            <div className="grid md:grid-cols-2 gap-8">
              {BLOG_POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                <div 
                  key={post.id}
                  onClick={() => onSelectPost(post.id)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-lg shadow-zinc-200/50 dark:shadow-none">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h5 className="font-black group-hover:text-primary transition-colors text-zinc-900 dark:text-white">{post.title}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.category))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">{t('landing.blog.badge')}</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">{t('landing.blog.title')}</h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">{t('landing.blog.description')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchQuery ?? ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 h-12 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                selectedCategory === category 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer"
              onClick={() => onSelectPost(post.id)}
            >
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-4 font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </div>
              </div>
              
              <h4 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight text-zinc-900 dark:text-white">
                {post.title}
              </h4>
              
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${post.author}`} alt={post.author} referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{post.author}</span>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 font-bold">No articles found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-primary font-black uppercase tracking-widest text-xs"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
