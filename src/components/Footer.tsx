import { motion } from 'motion/react';
import { Heart, Instagram, Github, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer = ({ setView }: { setView: (v: any) => void }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative w-full overflow-hidden bg-[var(--bg)] mt-20 md:mt-40">
      <footer id="footer" className="relative w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center md:items-end p-10 md:p-20 footer-gradient-overlay pb-24 h-full">
        <div className="footer-backdrop" />
        
        {/* Col 1 */}
        <div className="flex flex-col items-start justify-start p-4 w-full md:w-[28%] z-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
              <Heart size={24} className="text-white" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-white tracking-tighter">O Nosso Eterno</h3>
          </div>
          
          <p className="text-lg font-serif italic text-white/50 leading-relaxed">
            Um tributo digital a cada momento, cada foto e cada música que compõe a nossa história.
          </p>

          <div className="social flex flex-row justify-start gap-4">
            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-[var(--primary)] rounded-xl flex items-center justify-center transition-all group border border-white/5 hover:border-[var(--primary)]/30">
              <Instagram size={20} className="text-white/30 group-hover:text-white" />
            </a>
            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-[var(--primary)] rounded-xl flex items-center justify-center transition-all group border border-white/5 hover:border-[var(--primary)]/30">
              <Github size={20} className="text-white/30 group-hover:text-white" />
            </a>
            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-[var(--primary)] rounded-xl flex items-center justify-center transition-all group border border-white/5 hover:border-[var(--primary)]/30">
              <ArrowUpRight size={20} className="text-white/30 group-hover:text-white" />
            </a>
          </div>

          <div className="mt-8 space-y-4">
             <div className="flex items-center gap-4 text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">
                <ShieldCheck size={14} className="text-emerald-500" /> 
                Preservado em Cloud
             </div>
             <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em]">{currentYear} © Direitos do Nosso Amor Reservados</p>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col items-start justify-start p-10 w-full md:w-[28%] z-10 gap-4 bg-[var(--bg-alt)]/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 mt-12 md:mt-0 group hover:border-white/10 transition-all luxury-card">
            <p className="text-white/30 font-mono text-[9px] uppercase tracking-[0.5em] mb-4">Arquivos</p>
            {['Sobre Nós', 'Nossa Missão', 'Privacidade', 'Termos de Amor'].map((link) => (
              <p key={link} className="text-lg text-white/60 hover:text-[var(--primary)] cursor-pointer transition-all hover:translate-x-2 font-serif italic">
                {link}
              </p>
            ))}
        </div>

        {/* Col 3 */}
        <div className="flex flex-col items-start justify-start p-10 w-full md:w-[28%] z-10 gap-4 bg-[var(--bg-alt)]/30 backdrop-blur-3xl rounded-[3rem] border border-white/5 mt-6 md:mt-0 group hover:border-white/10 transition-all luxury-card">
            <p className="text-white/30 font-mono text-[9px] uppercase tracking-[0.5em] mb-4">Funcionalidades</p>
            {['Galeria de Fotos', 'Cartas de Amor', 'Playlist Compartilhada', 'Jogos de Casal'].map((link) => (
              <p key={link} className="text-lg text-white/60 hover:text-[var(--primary)] cursor-pointer transition-all hover:translate-x-2 font-serif italic">
                {link}
              </p>
            ))}
        </div>

        {/* Back to Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-[var(--primary)] transition-all z-20 group"
        >
          <ArrowUpRight size={24} className="group-hover:-rotate-45 transition-transform" />
        </button>
      </footer>
    </div>
  );
};
