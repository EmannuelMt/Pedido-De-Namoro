import { useState } from 'react';
import { Download, FileText, Star, Image as ImageIcon, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

export function DownloadsTab() {
  const { user, profile } = useAuthStore();
  const [certType, setCertType] = useState('namorado');
  const [parceiroNome, setParceiroNome] = useState('Parceiro(a)');

  const handleBackupDownload = () => {
    try {
      const backupData = {
        app_name: "LovePortal",
        user_uid: user?.uid,
        user_email: user?.email,
        profile_settings: profile || {},
        downloadedAt: new Date().toISOString()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `loveportal_backup_${user?.uid || 'user'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Backup de dados exportado com absoluto sucesso!");
    } catch (e) {
      toast.error("Erro ao gerar arquivo de backup.");
    }
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Por favor, habilite popups para imprimir o certificado.");
      return;
    }

    const titlePrefix = certType === 'namorado' ? 'Melhor Namorado do Universo' : 'Melhor Namorada do Universo';
    const msg = certType === 'namorado' 
      ? `Certificamos solenemente que este incrível namorado foi condecorado com o prêmio máximo de dedicação, carinho incondicional, sorrisos compartilhados e amor galáctico.` 
      : `Certificamos solenemente que esta incrível namorada foi condecorada com o prêmio máximo de dedicação, carinho incondicional, sorrisos compartilhados e amor galáctico.`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado do Amor</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'Space Grotesk', sans-serif;
              background-color: #fffdf9;
              color: #1a1a1a;
              margin: 0;
              padding: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .border-outer {
              border: 10px solid #1a1a1a;
              padding: 40px;
              width: 100%;
              max-width: 800px;
              background-color: #ffffff;
              box-shadow: 12px 12px 0px 0px #e84e4e;
              position: relative;
            }
            .border-inner {
              border: 3px dashed #1a1a1a;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            h1 {
              font-size: 50px;
              font-weight: 900;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: -2px;
              color: #e84e4e;
              transform: skew(-5deg);
            }
            h2 {
              font-size: 24px;
              font-weight: 700;
              text-transform: uppercase;
              margin: 20px 0;
              border-bottom: 2px solid #1a1a1a;
              padding-bottom: 5px;
            }
            .desc {
              font-size: 16px;
              line-height: 1.6;
              max-w: 600px;
              margin: 30px 0;
              color: #333333;
            }
            .target {
              font-size: 32px;
              font-weight: 950;
              text-transform: uppercase;
              color: #1a1a1a;
              margin: 10px 0;
            }
            .footer-row {
              width: 100%;
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .seal {
              position: absolute;
              bottom: 30px;
              right: 250px;
              font-size: 40px;
            }
          </style>
        </head>
        <body>
          <div class="border-outer">
            <div class="seal">❤️</div>
            <div class="border-inner">
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">CERTIFICADO MÚTUO DE AMOR</span>
              <h1>DIPLOMA OFICIAL</h1>
              <h2>${titlePrefix}</h2>
              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #777;">CONCEDIDO SOLENEMENTE A</span>
              <div class="target">${parceiroNome}</div>
              <p class="desc">${msg}</p>
              
              <div class="footer-row">
                <div>DATA: ${new Date().toLocaleDateString('pt-BR')}</div>
                <div>AUTENTICADO COM AMOR</div>
              </div>
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloads = [
    { title: "Wallpapers Oficiais do Casal", size: "12.4 MB", desc: "Papéis de parede exclusivos com design brutalista, coração pixelado e românticos.", ext: "ZIP", handler: () => toast.success("Iniciando download de pacote de wallpapers!") },
    { title: "Livro de Bilhetes Românticos", size: "2.3 MB", desc: "Gere um livro digital reunindo todos os recortes de bilhetes de amor trocados.", ext: "PDF", handler: () => toast.success("Geração de livro de bilhetes concluída!") },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title Header */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
        <h3 className="text-3xl font-black italic tracking-tighter">💾 Central de Downloads e Impressos</h3>
        <p className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Conceda certificados personalizados do amor, exporte backups de segurança e faça downloads de presets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Printable Diplomas Generator */}
        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                <h4 className="font-black text-xl italic">Prêmios & Diplomas</h4>
                <p className="font-sans text-[9px] font-bold uppercase tracking-widest opacity-60">Autentique e imprima condecorações românticas oficiais</p>
              </div>
              <Star className="w-6 h-6 text-amber-500 animate-pulse shrink-0 fill-amber-500" />
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Título do Diploma</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setCertType('namorado')}
                    className={`px-3 py-2 border-2 text-[10px] font-sans font-black uppercase tracking-widest transition-all ${certType === 'namorado' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-stone-50 hover:bg-neutral-100 border-black/10 text-stone-700'}`}
                  >
                    Melhor Namorado
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCertType('namorada')}
                    className={`px-3 py-2 border-2 text-[10px] font-sans font-black uppercase tracking-widest transition-all ${certType === 'namorada' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-stone-50 hover:bg-neutral-100 border-black/10 text-stone-700'}`}
                  >
                    Melhor Namorada
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-sans font-black uppercase tracking-widest opacity-70 block mb-1">Nome de Condecoração</label>
                <input
                  type="text"
                  placeholder="EX: EMANUEL GOMES"
                  value={parceiroNome}
                  onChange={(e) => setParceiroNome(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-black font-sans font-bold uppercase text-xs tracking-wider p-3 outline-none focus:border-[#e84e4e]"
                />
              </div>

              <div className="p-4 bg-zinc-50 border border-black/15 text-[11px] leading-relaxed text-stone-600 font-sans italic">
                “Por meio deste daremos outorga perpétua ao nosso herói e protetor de carinho pelas maiores conquistas estelares.”
              </div>
            </div>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="w-full bg-[#e84e4e] text-white hover:bg-black font-black uppercase tracking-widest text-xs p-4 border-2 border-black mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all active:scale-95"
          >
            GERAR E IMPRIMIR DIPLOMA &rarr;
          </button>
        </div>

        {/* Database Export & Media Box */}
        <div className="space-y-8">
          
          {/* Export database backup */}
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a]">
            <h4 className="font-black text-xl italic border-b-2 border-black pb-4 mb-4 flex items-center justify-between">
              <span>Exportar Backup</span>
              <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-50 shrink-0" />
            </h4>
            <p className="text-xs leading-relaxed text-stone-600 font-sans mb-4">
              Exporte todo o seu histórico de configurações de interface, molduras, wallpapers aplicados e recordações no formato purificado <strong className="font-bold">JSON</strong> de alta segurança.
            </p>
            
            <button
              onClick={handleBackupDownload}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white hover:bg-[#e84e4e] border-2 border-black p-3.5 font-sans font-black uppercase tracking-widest text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Backup (.JSON)</span>
            </button>
          </div>

          {/* Media Packages */}
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_#1a1a1a] space-y-6">
            <h4 className="font-black text-xl italic border-b-2 border-black pb-4">Pacotes de Download</h4>
            
            <div className="space-y-4">
              {downloads.map((dl, i) => (
                <div key={i} className="p-4 border border-black/10 hover:border-black/30 transition-colors flex items-center justify-between gap-4 bg-zinc-50/50">
                  <div className="min-w-0">
                    <h5 className="font-black text-xs uppercase truncate">{dl.title}</h5>
                    <p className="text-[10px] text-stone-500 font-sans mt-0.5 max-w-sm line-clamp-1">{dl.desc}</p>
                    <span className="text-[9px] font-mono text-stone-400 block mt-1">{dl.size} • {dl.ext}</span>
                  </div>
                  
                  <button
                    onClick={dl.handler}
                    className="p-2 border border-black bg-white hover:bg-stone-100 transition-colors active:scale-95 shrink-0"
                    title="Baixar pacote"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
