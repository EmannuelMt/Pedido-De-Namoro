import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Layers, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function AlbumsSection() {
  const albums = [
    {
      to: "/albuns",
      title: "Retrospectiva 2025",
      description: "Um compilado com tudo que passamos, sorrimos e conquistamos lado a lado no ano.",
      count: "28 FOTOS",
      status: "ATIVO",
      statusColor: "bg-emerald-400",
      accent: "bg-rose-50",
      label: "VOL. 25"
    },
    {
      to: "/albuns",
      title: "Férias & Estrada",
      description: "Todas as paradas espontâneas, pedágios, risadas de carro e lanches divididos.",
      count: "45 FOTOS",
      status: "CONCLUÍDO",
      statusColor: "bg-amber-400",
      accent: "bg-amber-50",
      label: "ESTRADA"
    }
  ];

  return (
    <section className="space-y-20 pt-24 border-t border-slate-100 max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10">
        <div className="space-y-6">
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-sans text-[10px] uppercase font-bold tracking-[0.3em] text-rose-500 flex items-center gap-4 bg-rose-50 w-fit px-5 py-2 rounded-2xl"
          >
            <Layers className="w-4 h-4 fill-rose-500" strokeWidth={0} />
            Coleção Curada
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Nossos Álbuns
          </h2>
          <p className="font-sans text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Pastas organizadas com amor, para que cada momento tenha o seu devido lugar em nossa jornada.
          </p>
        </div>
        <Link 
          to="/albuns" 
          className="group font-sans text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-4 w-fit"
        >
          Visualizar Catálogo <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
        {albums.map((album, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              to={album.to} 
              className={`p-8 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col sm:flex-row gap-8 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}
            >
              <div className={`w-full sm:w-40 h-40 ${album.accent} border border-slate-50 flex items-center justify-center relative rounded-2xl shrink-0 overflow-hidden group-hover:scale-105 transition-transform`}>
                  <Disc className="w-16 h-16 text-slate-400 group-hover:animate-[spin_4s_linear_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-4 font-sans text-[8px] font-bold tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-lg text-slate-500 shadow-sm uppercase">
                    {album.label}
                  </span>
              </div>
              
              <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${album.statusColor} rounded-full`} />
                      <span className="font-sans text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sync: {album.status}</span>
                    </div>
                    <h4 className="font-sans font-extrabold text-3xl text-slate-900 tracking-tight leading-none group-hover:text-rose-500 transition-colors">
                      {album.title}
                    </h4>
                    <p className="font-sans text-sm font-medium text-slate-500 leading-relaxed">
                      {album.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-4 py-1.5 rounded-lg">
                      {album.count}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                      Acessar <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
