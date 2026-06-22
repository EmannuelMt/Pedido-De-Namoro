import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function GallerySection() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop",
      title: "Praia & Sol 🏖️",
      label: 'Tarde Inesquecível',
      date: "Jan 2024",
      rotate: "hover:rotate-1"
    },
    {
      src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
      title: "Aniversário 🎂",
      label: 'Soprando as Velinhas',
      date: "Mar 2024",
      rotate: "hover:-rotate-1"
    },
    {
      src: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop",
      title: "Passeio Calmo 🌳",
      label: 'Piquenique nas Flores',
      date: "Mai 2024",
      rotate: "hover:rotate-1"
    }
  ];

  return (
    <section className="space-y-20 pt-24 border-t border-slate-100 max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10">
        <div className="space-y-6">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="font-sans text-[10px] uppercase font-bold tracking-[0.3em] text-emerald-600 flex items-center gap-4 bg-emerald-50 w-fit px-5 py-2 rounded-2xl"
          >
            <Camera className="w-4 h-4 fill-emerald-600" strokeWidth={0} />
            Visual Archive
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Nossa Galeria
          </h2>
          <p className="font-sans text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Cada sorriso e cada pequena aventura registrada para que a gente nunca esqueça o quanto somos felizes juntos.
          </p>
        </div>
        <Link 
          to="/galeria" 
          className="group font-sans text-xs font-bold uppercase tracking-widest text-slate-900 py-5 px-10 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-2xl shadow-sm flex items-center gap-4 w-fit"
        >
          Álbum Digital <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white border border-slate-100 p-4 shadow-xl shadow-slate-100/50 ${img.rotate} hover:scale-[1.02] transition-all duration-500 relative rounded-[2rem] group cursor-pointer`}
          >
            <div className="aspect-square bg-slate-50 rounded-2xl relative overflow-hidden">
               <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={img.src} alt={img.title} />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 py-2 px-4 font-sans text-[10px] font-bold uppercase tracking-widest rounded-xl z-20 shadow-sm border border-white">
                 {img.title}
               </div>
            </div>

            <div className="pt-6 text-center space-y-2">
               <div className="flex items-center justify-center gap-2">
                 <span className="font-sans text-xl tracking-tight text-slate-900 font-bold">{img.label}</span>
               </div>
               <div className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                 {img.date}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
