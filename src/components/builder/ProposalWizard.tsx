import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilderStore, BuilderStep } from '../../store/useBuilderStore';
import { ChevronRight, ChevronLeft, Heart, Lock, Clock, Sparkles, MapPin, Upload, Plus, Trash2 } from 'lucide-react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

// Component imports
const stepTitle = (step: BuilderStep) => {
  switch(step) {
    case 1: return "Quem é a pessoa especial?";
    case 2: return "Conexão Emocional";
    case 3: return "Identidade Visual";
    case 4: return "Nossa História";
    case 5: return "Quiz do Casal";
    case 6: return "Galeria de Memórias";
    case 7: return "O Pedido";
    case 8: return "Convite Inesquecível";
  }
};

const StepEmotional = () => {
  const { data, updateData } = useBuilderStore();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Comida Favorita</label>
          <input 
            type="text" 
            value={data.emotionalData.food}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, food: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: Sushi, Pizza..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Jogo ou Passatempo Favorito</label>
          <input 
            type="text" 
            value={data.emotionalData.games}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, games: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: Valorant, Stardew Valley..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Lugar Favorito de Vocês</label>
          <input 
            type="text" 
            value={data.emotionalData.places}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, places: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: Praia, Parque, Quarto chovendo..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Filme Favorito</label>
          <input 
            type="text" 
            value={data.emotionalData.movies}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, movies: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: Interstellar, La La Land..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Série ou Anime Favorito</label>
          <input 
            type="text" 
            value={data.emotionalData.series}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, series: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: The Office, Naruto..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">O Sonho de Vocês</label>
          <input 
            type="text" 
            value={data.emotionalData.dreams}
            onChange={e => updateData({ emotionalData: { ...data.emotionalData, dreams: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Ex: Morar num campo, viajar pra NY..."
          />
        </div>
      </div>
    </div>
  );
};

const StepTheme = () => {
  const { data, updateData } = useBuilderStore();
  
  const presets = [
    { id: 'luxury_classic', label: 'Luxury Classic' },
    { id: 'cosmic_nebula', label: 'Cosmic Nebula' },
    { id: 'glassmorphism', label: 'Glassmorphism' },
    { id: 'spike_planted', label: 'Spike Planted (Gamer)' },
    { id: 'matrix_terminal', label: 'Matrix Terminal (Dev)' },
    { id: 'noir_film', label: 'Noir Film (Cinema)' }
  ];

  const updateColor = (key: keyof typeof data.themeConfig.customColors, val: string) => {
    updateData({ 
      themeConfig: {
        ...data.themeConfig,
        type: 'custom',
        customColors: { ...data.themeConfig.customColors, [key]: val }
      }
    });

    // We can directly manipulate root variables for an instant live-preview effect!
    let varName = '';
    if (key === 'primary') varName = '--primary';
    if (key === 'accent') varName = '--accent';
    if (key === 'bg') varName = '--bg';
    if (key === 'bgAlt') varName = '--bg-alt';
    if (key === 'text') varName = '--text';
    
    if (varName) {
      document.documentElement.style.setProperty(varName, val);
    }
  };

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  const generateAITheme = async () => {
    if (!aiPrompt) return;
    setIsGeneratingTheme(true);
    try {
      const res = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiPrompt })
      });
      if (res.ok) {
        const colors = await res.json();
        // Update each color to preview it instantly
        if (colors.primary) updateColor('primary', colors.primary);
        if (colors.bg) updateColor('bg', colors.bg);
        if (colors.bgAlt) updateColor('bgAlt', colors.bgAlt);
        if (colors.text) updateColor('text', colors.text);
      } else {
        alert('Erro ao gerar tema com IA.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar tema com IA.');
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Nível 1: Presets Rápidos */}
      <div className="space-y-4">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">1. Escolha Rápida (Presets)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => {
                updateData({ themeConfig: { ...data.themeConfig, type: 'preset', presetKey: p.id }});
                document.documentElement.setAttribute('data-theme', p.id);
                document.body.setAttribute('data-theme', p.id);
              }}
              className={`p-4 rounded-2xl border text-sm transition-all ${data.themeConfig.type === 'preset' && data.themeConfig.presetKey === p.id ? 'border-rose-500 bg-rose-500/20 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nível 3: Tema por IA */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" /> 2. Inteligência Artificial
        </label>
        <p className="text-white/40 text-xs pl-2 mb-4">Descreva como deve ser o universo e a IA cria as cores pra você.</p>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Ex: Um céu noturno estrelado com tons de roxo e magia..."
            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none"
          />
          <button 
            onClick={generateAITheme}
            disabled={isGeneratingTheme || !aiPrompt}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-8 rounded-2xl font-semibold transition-all flex items-center gap-2"
          >
            {isGeneratingTheme ? 'Gerando...' : 'Gerar'} <Sparkles size={16} />
          </button>
        </div>
      </div>

      {/* Editor Visual */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2 flex items-center gap-2">
          3. Editor Visual (Personalização)
        </label>
        <p className="text-white/40 text-xs pl-2 mb-4">Ajuste fino nas cores do seu universo</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
            <input 
              type="color" 
              value={data.themeConfig.customColors.primary} 
              onChange={(e) => updateColor('primary', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-white/80 text-sm">Cor Principal (Glow)</span>
          </div>

          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
            <input 
              type="color" 
              value={data.themeConfig.customColors.bg} 
              onChange={(e) => updateColor('bg', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-white/80 text-sm">Cor de Fundo Principal</span>
          </div>

          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
            <input 
              type="color" 
              value={data.themeConfig.customColors.bgAlt} 
              onChange={(e) => updateColor('bgAlt', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-white/80 text-sm">Fundo Secundário (Atmosfera)</span>
          </div>

          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
            <input 
              type="color" 
              value={data.themeConfig.customColors.text} 
              onChange={(e) => updateColor('text', e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-white/80 text-sm">Cor dos Textos</span>
          </div>
        </div>
      </div>

      {/* Font & Particles Customization */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <div>
           <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2 block mb-3">
             Tipografia (Fonte)
           </label>
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
             {[
               { id: 'serif', label: 'Elegante (Romântico)', fontClass: 'font-serif' },
               { id: 'sans', label: 'Moderno (Clean)', fontClass: 'font-sans' },
               { id: 'mono', label: 'Futurista (Gamer/Dev)', fontClass: 'font-mono' }
             ].map(f => (
               <button
                 key={f.id}
                 onClick={() => {
                   updateData({ themeConfig: { ...data.themeConfig, customStyle: { ...data.themeConfig.customStyle, fontStyle: f.id } } });
                   document.documentElement.style.setProperty('--theme-font-heading', `var(--font-${f.id})`);
                 }}
                 className={`p-3 rounded-xl border text-sm text-center transition-all ${f.fontClass} ${data.themeConfig.customStyle.fontStyle === f.id ? 'border-rose-500 bg-rose-500/20 text-white' : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/10'}`}
               >
                 {f.label}
               </button>
             ))}
           </div>
        </div>

        <div>
           <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2 block mb-3">
             Efeitos (Partículas)
           </label>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
             {[
               { id: 'stars', label: 'Estrelas' },
               { id: 'petals', label: 'Pétalas' },
               { id: 'rain', label: 'Chuva' },
               { id: 'snow', label: 'Neve' },
               { id: 'magic', label: 'Magia' },
               { id: 'none', label: 'Nenhum' }
             ].map(p => (
               <button
                 key={p.id}
                 onClick={() => updateData({ themeConfig: { ...data.themeConfig, customStyle: { ...data.themeConfig.customStyle, particles: p.id } } })}
                 className={`p-3 rounded-xl border text-sm text-center transition-all ${data.themeConfig.customStyle.particles === p.id ? 'border-rose-500 bg-rose-500/20 text-white' : 'border-white/10 bg-black/40 text-white/50 hover:bg-white/10'}`}
               >
                 {p.label}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const StepBasic = () => {
  const { data, updateData } = useBuilderStore();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Nome do amor da sua vida</label>
        <input 
          type="text" 
          value={data.partner.name}
          onChange={e => updateData({ partner: { ...data.partner, name: e.target.value } })}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
          placeholder="Ex: Amanda"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Apelido (opcional)</label>
        <input 
          type="text" 
          value={data.partner.nickname}
          onChange={e => updateData({ partner: { ...data.partner, nickname: e.target.value } })}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
          placeholder="Ex: Vida"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Data Especial (Aniversário/Início)</label>
        <input 
          type="date" 
          value={data.partner.specialDate}
          onChange={e => updateData({ partner: { ...data.partner, specialDate: e.target.value } })}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Emoji/Símbolo do Casal</label>
        <div className="flex gap-4">
          {['💖', '✨', '🪐', '🌙', '🌊', '🐱', '🎮', '🥀'].map(emoji => (
            <button
              key={emoji}
              onClick={() => updateData({ partner: { ...data.partner, symbol: emoji } })}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border transition-all ${data.partner.symbol === emoji ? 'border-rose-500 bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepStory = () => {
  const { data, updateData } = useBuilderStore();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Como nos conhecemos?</label>
        <textarea 
          value={data.story.howWeMet}
          onChange={e => updateData({ story: { ...data.story, howWeMet: e.target.value } })}
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors resize-none"
          placeholder="Era uma tarde de domingo..."
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Primeiro Encontro</label>
        <textarea 
          value={data.story.firstDate}
          onChange={e => updateData({ story: { ...data.story, firstDate: e.target.value } })}
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors resize-none"
          placeholder="Fomos tomar um café..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-sm font-semibold uppercase tracking-widest pl-2">Texto Emocional (Aparece antes do pedido)</label>
        <textarea 
          value={data.story.emotionalText}
          onChange={e => updateData({ story: { ...data.story, emotionalText: e.target.value } })}
          rows={4}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors resize-none"
          placeholder="Eu sabia desde o primeiro dia..."
        />
      </div>
    </div>
  );
};

const StepQuiz = () => {
  const { data, updateData } = useBuilderStore();

  const addQuiz = () => {
    updateData({ 
      quizzes: [...data.quizzes, { 
        question: '', 
        options: ['', '', '', ''], 
        answer: 0, 
        wrongMsg: 'Hmm, tem certeza?', 
        rightMsg: 'Isso aí! 🥰' 
      }] 
    });
  };

  const updateQuiz = (index: number, partialData: any) => {
    const newQuizzes = [...data.quizzes];
    newQuizzes[index] = { ...newQuizzes[index], ...partialData };
    updateData({ quizzes: newQuizzes });
  };

  const removeQuiz = (index: number) => {
    const newQuizzes = [...data.quizzes];
    newQuizzes.splice(index, 1);
    updateData({ quizzes: newQuizzes });
  };

  return (
    <div className="space-y-8">
      {data.quizzes.map((quiz, i) => (
        <div key={i} className="glass-card p-6 rounded-3xl border border-white/10 relative group">
          <button 
            onClick={() => removeQuiz(i)}
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:text-rose-500 hover:border-rose-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="space-y-4">
            <input 
              type="text" 
              value={quiz.question}
              onChange={e => updateQuiz(i, { question: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 pb-2 text-xl text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors font-medium"
              placeholder={`Pergunta ${i + 1} (Ex: Onde foi nosso primeiro beijo?)`}
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              {quiz.options.map((opt, optIndex) => (
                <div key={optIndex} className="relative flex items-center">
                  <input
                    type="radio"
                    name={`quiz-${i}`}
                    checked={quiz.answer === optIndex}
                    onChange={() => updateQuiz(i, { answer: optIndex })}
                    className="absolute left-4 w-4 h-4 accent-rose-500"
                  />
                  <input 
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...quiz.options];
                      newOpts[optIndex] = e.target.value;
                      updateQuiz(i, { options: newOpts });
                    }}
                    placeholder={`Opção ${optIndex + 1}`}
                    className={`w-full bg-black/40 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors ${quiz.answer === optIndex ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/5 focus:border-white/20'}`}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <input 
                type="text" value={quiz.wrongMsg} onChange={e => updateQuiz(i, { wrongMsg: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-red-300 placeholder-white/30 focus:outline-none"
                placeholder="Mensagem Erro"
              />
              <input 
                type="text" value={quiz.rightMsg} onChange={e => updateQuiz(i, { rightMsg: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-green-300 placeholder-white/30 focus:outline-none"
                placeholder="Mensagem Acerto"
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addQuiz} className="w-full py-4 border border-dashed border-white/20 rounded-3xl text-white/50 hover:text-white hover:border-white/50 transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> Adicionar Pergunta Interativa
      </button>
    </div>
  );
};

const StepGallery = () => {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center text-center py-12">
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
         <Upload className="text-white/40" size={32} />
      </div>
      <h3 className="text-xl font-medium text-white">Galeria Temática</h3>
      <p className="text-white/50 max-w-sm">No momento, as fotos e vídeos desta experiência maravilhosa são adicionados via aba "Memórias" no site. Salve o pedido e acesse a home!</p>
    </div>
  )
}

const StepAccess = () => {
  const { data, updateData } = useBuilderStore();
  
  const options = [
    { id: 'none', icon: <Heart size={24}/>, label: 'Link Simples', desc: 'Apenas enviar o link' },
    { id: 'password', icon: <Lock size={24}/>, label: 'Palavra Passe', desc: 'Exige uma senha' },
    { id: 'secretQuestion', icon: <Sparkles size={24}/>, label: 'Pergunta Secreta', desc: 'O que só vocês sabem?' },
    { id: 'location', icon: <MapPin size={24}/>, label: 'Restrito por Local', desc: 'Só abre no restaurante' },
    { id: 'timer', icon: <Clock size={24}/>, label: 'Temporizador', desc: 'Libera em data exata' }
  ] as const;

  return (
    <div className="space-y-6">
      <h3 className="text-lg text-white font-medium mb-4">Como a pessoa entra na experiência?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => updateData({ access: { ...data.access, type: opt.id } })}
            className={`p-6 rounded-3xl border flex flex-col items-start gap-4 transition-all text-left ${data.access.type === opt.id ? 'bg-rose-500/20 border-rose-500' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
          >
            <div className={`p-3 rounded-xl ${data.access.type === opt.id ? 'bg-rose-500/50 text-white' : 'bg-white/5 text-white/50'}`}>
              {opt.icon}
            </div>
            <div>
              <h4 className="text-white font-medium">{opt.label}</h4>
              <p className="text-white/40 text-sm mt-1">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {data.access.type === 'secretQuestion' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-8 bg-white/5 p-6 rounded-3xl border border-white/10">
          <input 
            type="text" value={data.access.secretQuestion || ''} onChange={e => updateData({ access: { ...data.access, secretQuestion: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none"
            placeholder="Qual o nome do nosso primeiro pet?"
          />
          <input 
            type="text" value={data.access.accessAnswer || ''} onChange={e => updateData({ access: { ...data.access, accessAnswer: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none"
            placeholder="Resposta exata"
          />
        </motion.div>
      )}

      {data.access.type === 'password' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-8 bg-white/5 p-6 rounded-3xl border border-white/10">
          <input 
            type="text" value={data.access.password || ''} onChange={e => updateData({ access: { ...data.access, password: e.target.value } })}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none"
            placeholder="Senha de acesso"
          />
        </motion.div>
      )}
    </div>
  );
}


export const ProposalWizard = ({ onClose }: { onClose: () => void }) => {
  const { currentStep, nextStep, prevStep, setStep, data } = useBuilderStore();
  const [isSaving, setIsSaving] = useState(false);

  const saveProposal = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const universeRef = doc(db, "universes", auth.currentUser.uid);
      await updateDoc(universeRef, {
        creatorId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        settings: data
      }).catch(async (e) => {
         // If doc doesn't exist, we create it
         const { setDoc } = await import('firebase/firestore');
         await setDoc(universeRef, {
           creatorId: auth.currentUser!.uid,
           createdAt: new Date().toISOString(),
           settings: data
         });
      });
      // Set to user
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        universeConfigured: true
      });
      // Success
      alert('Universo Criado com Sucesso!');
      onClose();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar Universo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex flex-col pt-12 custom-scrollbar overflow-y-auto">
      
      <div className="max-w-4xl w-full mx-auto px-6 pb-24">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={onClose} className="px-6 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest font-semibold">
            Cancelar
          </button>
          
          <div className="flex gap-2">
            {[1,2,3,4,5,6,7,8].map(step => (
              <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${step === currentStep ? 'w-12 bg-rose-500' : step < currentStep ? 'w-6 bg-rose-500/30' : 'w-6 bg-white/10'}`} />
            ))}
          </div>

          <div className="w-24"></div> {/* spacer */}
        </div>

        {/* Title */}
        <div className="mb-12">
          <h4 className="text-rose-500 font-mono text-sm tracking-[0.3em] uppercase mb-2">ETAPA {currentStep} DE 8</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{stepTitle(currentStep)}</h2>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[400px]"
          >
            {currentStep === 1 && <StepBasic />}
            {currentStep === 2 && <StepEmotional />}
            {currentStep === 3 && <StepTheme />}
            {currentStep === 4 && <StepStory />}
            {currentStep === 5 && <StepQuiz />}
            {currentStep === 6 && <StepGallery />}
            {currentStep === 7 && (
              <div className="flex flex-col items-center py-12 text-center space-y-6">
                <Heart size={48} className="text-rose-500 animate-pulse" />
                <h3 className="text-2xl text-white font-medium">A Tela Cinemática foi ativada.</h3>
                <p className="text-white/50 max-w-md">O Pedido final usará a música escolhida, o símbolo e será processado na variante "cinematic" para a melhor experiência emocional do destinatário.</p>
              </div>
            )}
            {currentStep === 8 && <StepAccess />}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-10 pointer-events-none">
          <div className="max-w-4xl w-full flex justify-between pointer-events-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${currentStep === 1 ? 'opacity-0' : 'opacity-100 bg-white/5 hover:bg-white/10 text-white'}`}
            >
              <ChevronLeft size={20} /> Voltar
            </button>
            
            {currentStep < 8 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Próxima Etapa <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={saveProposal}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 rounded-full font-semibold bg-rose-500 text-white hover:bg-rose-600 hover:scale-105 transition-all shadow-[0_0_30px_rgba(244,63,94,0.4)]"
              >
                {isSaving ? 'Gerando Experiência...' : 'Finalizar Pedido'} <Sparkles size={20} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
