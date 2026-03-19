import React from 'react';
import { 
  Search, 
  Book, 
  MessageCircle, 
  FileText, 
  HelpCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  PlayCircle,
  LifeBuoy
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Input } from '../App';

export const HelpCenter: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto transition-colors duration-300">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">How can we help?</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">Search our knowledge base or browse categories below.</p>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input 
            placeholder="Search for articles, guides, and more..." 
            className="h-14 pl-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-primary/5 text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <Book className="w-6 h-6" />,
            title: "Getting Started",
            description: "Learn the basics of Glob$ourcia and set up your account.",
            articles: 12
          },
          {
            icon: <FileText className="w-6 h-6" />,
            title: "RFQ Management",
            description: "How to create, manage, and optimize your sourcing requests.",
            articles: 24
          },
          {
            icon: <Truck className="w-6 h-6" />,
            title: "Logistics & Tracking",
            description: "Everything you need to know about shipping and tracking.",
            articles: 18
          }
        ].map((cat, i) => (
          <Card key={i} className="p-8 hover:border-primary/20 transition-all cursor-pointer group bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-colors mb-6">
              {cat.icon}
            </div>
            <h3 className="text-xl font-black mb-2 text-zinc-900 dark:text-white">{cat.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">{cat.description}</p>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">
              <span>{cat.articles} Articles</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-zinc-900 dark:bg-zinc-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden border border-zinc-800">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest mb-6">
              <PlayCircle className="w-3 h-3" />
              Video Tutorials
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-4">Watch and Learn</h3>
            <p className="text-zinc-400 mb-8 max-w-md">Our video guides walk you through every feature of the platform, from basic setup to advanced analytics.</p>
            <button className="px-8 py-4 bg-white text-zinc-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              Browse Videos
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/20 to-transparent" />
        </div>

        <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest mb-6">
              <MessageCircle className="w-3 h-3" />
              Direct Support
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-4">Need more help?</h3>
            <p className="text-white/80 mb-8 max-w-md">Our support team is available 24/7 to help you with any questions or technical issues you might encounter.</p>
            <button className="px-8 py-4 bg-zinc-900 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              Contact Support
              <LifeBuoy className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-secondary/20 to-transparent" />
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-16">
        <h3 className="text-xl font-black mb-8 text-zinc-900 dark:text-white">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              q: "How do I verify my supplier?",
              a: "Our sourcing agents perform on-site inspections and background checks for all suppliers in our network."
            },
            {
              q: "What are the shipping costs?",
              a: "Shipping costs are calculated based on weight, volume, destination, and chosen transport mode."
            },
            {
              q: "Is my payment secure?",
              a: "Yes, we use an escrow system where funds are only released when you confirm receipt of goods."
            },
            {
              q: "Can I track my shipment in real-time?",
              a: "Absolutely. Every shipment comes with a tracking number and real-time status updates."
            }
          ].map((faq, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-bold text-zinc-900 dark:text-white">{faq.q}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
