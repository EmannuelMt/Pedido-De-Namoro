import { motion } from 'motion/react';
import { Heart, Instagram, Github, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
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
              <h3 className="f-title f_600 f_size_18">Nosso Espaço</h3>
              <p>Receba recados carinhosos e atualizações sobre a nossa história!</p>
              <form action="#" className="f_subscribe_two mailchimp" method="post">
                <input type="text" name="EMAIL" className="form-control memail" placeholder="Email" />
                <button className="btn btn_get btn_get_two" type="button">Inscrever-se</button>
              </form>
            </div>
            
            {/* Col 2 */}
            <div className="f_widget about-widget">
              <h3 className="f-title f_600 f_size_18">Arquivos</h3>
              <ul className="list-unstyled f_list">
                <li><a href="#">A Nossa Trilha</a></li>
                <li><a href="#">Galeria de Fotos</a></li>
                <li><a href="#">Momento Memorável</a></li>
                <li><a href="#">Nossa Missão</a></li>
                <li><a href="#">Futuro</a></li>
              </ul>
            </div>
            
            {/* Col 3 */}
            <div className="f_widget about-widget">
              <h3 className="f-title f_600 f_size_18">Ajuda</h3>
              <ul className="list-unstyled f_list">
                <li><a href="#">Como Funciona</a></li>
                <li><a href="#">Termos de Amor</a></li>
                <li><a href="#">Reportar Bug na Relação</a></li>
                <li><a href="#">Manual de Uso</a></li>
                <li><a href="#">Privacidade</a></li>
              </ul>
            </div>
            
            {/* Col 4 */}
            <div className="f_widget social-widget">
              <h3 className="f-title f_600 f_size_18">Social</h3>
              <div className="f_social_icon flex gap-2">
                <a href="#"><Instagram size={20} /></a>
                <a href="#"><Github size={20} /></a>
                <a href="#"><Heart size={20} /></a>
                <a href="#"><Sparkles size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Backgrounds */}
        <div className="footer_bg border-t border-white/5 pointer-events-none">
          <div className="footer_bg_one"></div>
          <div className="footer_bg_two"></div>
        </div>
      </div>
      
      <div className="footer_bottom relative z-20 bg-black/10 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
               <div>
                 <p className="mb-0 f_400 font-mono text-sm tracking-wider uppercase text-white/50">© {currentYear} Todos os direitos do nosso amor reservados.</p>
               </div>
               <div>
                  <p className="font-mono text-sm tracking-wide text-white/50 flex items-center justify-center md:justify-end gap-2">
                     <ShieldCheck size={16} className="text-emerald-500" /> Preservado na Cloud <Heart size={14} className="text-[var(--primary)] ml-2" />
                  </p>
               </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-24 right-6 md:bottom-20 md:right-10 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-[var(--primary)] transition-all z-30 group"
      >
        <ArrowUpRight size={20} className="group-hover:-rotate-45 transition-transform" />
      </button>
    </footer>
  );
};

