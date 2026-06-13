import { motion } from 'motion/react';
import { Heart, Instagram, Github, ArrowUpRight, ShieldCheck, Sparkles, Terminal, Activity } from 'lucide-react';
import './Footer.css';

export const Footer = ({ setView }: { setView: (v: any) => void }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="new_footer_area bg_color w-full">
      <div className="new_footer_top w-full">
        <div className="container mx-auto px-4 w-full max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-[150px]">
            {/* Col 1 */}
            <div className="company_widget">
              <h3 className="f-title f_600 f_size_18 font-mono text-white tracking-widest flex items-center gap-2">
                 <Terminal size={18} className="text-[#d4af37]" />
                 System.Sync()
              </h3>
              <p className="font-mono text-sm text-slate-400">Inscreva-se no protocolo de comunicação para receber logs afetivos e atualizações de nossa rede neural.</p>
              <form action="#" className="f_subscribe_two mailchimp mt-4" method="post">
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">{">"}</span>
                   <input type="text" name="EMAIL" className="form-control memail font-mono text-sm pl-8 bg-black/40 border-white/10" placeholder="user@heart.net" />
                </div>
                <button className="btn btn_get btn_get_two font-mono uppercase tracking-widest bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition-all w-full mt-2" type="button">Estabelecer Sincronização</button>
              </form>
            </div>
            
            {/* Col 2 */}
            <div className="f_widget about-widget">
              <h3 className="f-title f_600 f_size_18 font-mono text-white tracking-widest">Data.Archives</h3>
              <ul className="list-unstyled f_list font-mono text-sm text-slate-400 space-y-3">
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"{ A Nossa Trilha }"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"{ Galeria_de_Memórias.jpg }"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"{ Momentos_Marcantes }"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"{ Nossa_Missão }"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"{ Futuro.exe }"}</a></li>
              </ul>
            </div>
            
            {/* Col 3 */}
            <div className="f_widget about-widget">
              <h3 className="f-title f_600 f_size_18 font-mono text-white tracking-widest">Sys.Help</h3>
              <ul className="list-unstyled f_list font-mono text-sm text-slate-400 space-y-3">
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"< Como_Funciona />"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"< Termos_de_Amor />"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"< Debug_na_Relação />"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"< Manual_de_Uso />"}</a></li>
                <li><a href="#" className="hover:text-[#d4af37] hover:pl-2 transition-all block">{"< Configuração_Afetiva />"}</a></li>
              </ul>
            </div>
            
            {/* Col 4 */}
            <div className="f_widget social-widget">
              <h3 className="f-title f_600 f_size_18 font-mono text-white tracking-widest">Network.Social</h3>
              <div className="f_social_icon flex gap-2">
                <a href="#" className="hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors"><Instagram size={18} /></a>
                <a href="#" className="hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors"><Github size={18} /></a>
                <a href="#" className="hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors"><Heart size={18} /></a>
                <a href="#" className="hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors"><Sparkles size={18} /></a>
              </div>
              <div className="mt-8 p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-slate-500 uppercase flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500" />
                    <span>Status: <span className="text-emerald-400">Online</span></span>
                 </div>
                 <div className="flex items-center gap-2 pl-5">
                    <span>Ping: <span className="text-[#d4af37]">0ms</span> (Sincronizado)</span>
                 </div>
                 <div className="flex items-center gap-2 pl-5">
                    <span>Uptime: <span className="text-white">100%</span> (Amor)</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Backgrounds */}
        <div className="footer_bg border-t border-white/5 pointer-events-none opacity-50">
          <div className="footer_bg_one filter invert mix-blend-screen opacity-40 grayscale"></div>
          <div className="footer_bg_two filter invert mix-blend-screen opacity-40 grayscale"></div>
        </div>
      </div>
      
      <div className="footer_bottom relative z-20 bg-black/40 backdrop-blur-md border-t border-[#d4af37]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
               <div>
                 <p className="mb-0 f_400 font-mono text-[11px] tracking-widest uppercase text-slate-400">
                   <span className="text-[#d4af37]">© {currentYear}</span> Todos os direitos do nosso amor reservados.
                 </p>
               </div>
               <div>
                  <p className="font-mono text-[11px] tracking-widest text-[#d4af37] flex items-center justify-center md:justify-end gap-2 uppercase">
                     <ShieldCheck size={14} className="text-emerald-500" />
                     SECURE CONNECTION ESTABLISHED
                     <Heart size={12} className="text-rose-500 ml-1 animate-pulse" />
                  </p>
               </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-24 right-6 md:bottom-20 md:right-10 w-12 h-12 bg-black/60 backdrop-blur-md border border-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37]/60 hover:text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all z-30 group"
      >
        <ArrowUpRight size={20} className="group-hover:-rotate-45 transition-transform" />
      </button>
    </footer>
  );
};


