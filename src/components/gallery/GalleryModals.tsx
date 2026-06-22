import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Heart, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Music, 
  Send, 
  User,
  Image as ImageIcon,
  Link,
  Upload,
  Clock
} from 'lucide-react';
import { Memory, Comment } from '../../types';

interface DetailViewProps {
  memory: Memory;
  onClose: () => void;
  onLike: (id: string, likes: number, e: React.MouseEvent) => void;
  onAddComment: (e: React.FormEvent) => void;
  newCommentText: string;
  setNewCommentText: (t: string) => void;
  commentAuthor: string;
  setCommentAuthor: (a: string) => void;
  user: any;
}

export function GalleryDetailView({
  memory,
  onClose,
  onLike,
  onAddComment,
  newCommentText,
  setNewCommentText,
  commentAuthor,
  setCommentAuthor,
  user
}: DetailViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50, rotate: -1 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.9, y: 50, rotate: 1 }}
        className="bg-white border-[6px] border-black rounded-[4rem] shadow-[24px_24px_0px_0px_#000] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 bg-black text-white p-4 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[6px_6px_0px_0px_#ff90e8]"
        >
          <X className="w-8 h-8" strokeWidth={5} />
        </button>

        {/* Left Side: Image */}
        <div className="md:w-[55%] h-[400px] md:h-full relative overflow-hidden bg-stone-100 border-b-[6px] md:border-b-0 md:border-r-[6px] border-black group">
          <img 
            src={memory.imageUrl} 
            alt={memory.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
          />
          {/* Subtle Overlay Label */}
          <div className="absolute top-10 left-10 bg-[#ff90e8] text-black px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] rotate-[-5deg] border-[4px] border-black shadow-[8px_8px_0px_0px_#000]">
            {memory.theme} SCENE
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16 space-y-12 bg-[#fcf9f2]">
          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-[#4ade80] text-black px-5 py-2 border-[4px] border-black rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#000] rotate-1">
                {memory.category}
              </span>
              <div className="flex-1 h-[4px] bg-black/10 rounded-full" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-black">
              {memory.title}
            </h2>
            <div className="flex flex-wrap gap-8 text-[12px] font-black uppercase tracking-widest text-black/30 italic">
              <div className="flex items-center gap-3"><Calendar className="w-6 h-6 text-[#ff90e8]" strokeWidth={4} /> {memory.date}</div>
              <div className="flex items-center gap-3"><MapPin className="w-6 h-6 text-[#4ade80]" strokeWidth={4} /> {memory.location}</div>
              {memory.songTitle && <div className="flex items-center gap-3"><Music className="w-6 h-6 text-black" strokeWidth={4} /> {memory.songTitle}</div>}
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white border-[5px] border-black p-10 rounded-[3.5rem] shadow-[12px_12px_0px_0px_#000] rotate-1 group hover:rotate-0 transition-transform">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/10 mb-6 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#ff90e8]" /> A Nossa História
            </h4>
            <p className="text-lg md:text-2xl font-black leading-snug text-black italic">
              "{memory.story}"
            </p>
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl border-[4px] border-white shadow-[5px_5px_0px_0px_#ff90e8] -rotate-3">
                  {memory.addedBy?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/20">Registrado por</span>
                  <span className="block text-sm font-black uppercase tracking-tight">{memory.addedBy}</span>
                </div>
              </div>
              <button 
                onClick={(e) => onLike(memory.id, memory.likes || 0, e)}
                className="bg-[#rose-500] hover:bg-[#ff90e8] text-black border-[4px] border-black px-6 py-3 rounded-[2rem] flex items-center gap-4 shadow-[8px_8px_0px_0px_#000] hover:-translate-y-2 transition-all active:translate-y-0.5 active:shadow-none cursor-pointer group/like"
              >
                <Heart className={`w-6 h-6 transition-transform group-hover/like:scale-125 ${memory.likes ? 'fill-black' : ''}`} strokeWidth={4} />
                <span className="font-black text-xl">{memory.likes || 0}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-10 pt-4">
            <h4 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter flex items-center gap-6">
              Mural <div className="flex-1 h-[6px] bg-black rounded-full" />
            </h4>

            <div className="space-y-6">
              {memory.comments?.map((comment, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 shrink-0 bg-white border-[4px] border-black rounded-[1.5rem] flex items-center justify-center shadow-[5px_5px_0px_0px_#000] -rotate-3 group-hover:rotate-0 transition-transform">
                    <User className="w-8 h-8 text-black/10" strokeWidth={3} />
                  </div>
                  <div className="bg-white border-[4px] border-black p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#4ade80] flex-1 rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ff90e8]">{comment.author}</span>
                      <span className="text-[10px] font-black uppercase text-black/10 font-mono italic">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm md:text-lg font-black text-black italic leading-snug">"{comment.text}"</p>
                  </div>
                </div>
              ))}
              {(!memory.comments || memory.comments.length === 0) && (
                <div className="text-center py-16 opacity-30 border-[4px] border-dashed border-black/10 rounded-[3rem]">
                  <span className="text-sm font-black uppercase tracking-[0.4em] italic">Deixe a primeira reação!</span>
                </div>
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={onAddComment} className="pt-10 relative">
              <div className="bg-white border-[5px] border-black p-8 rounded-[3.5rem] shadow-[12px_12px_0px_0px_#ff90e8] flex flex-col gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Seu Nome</label>
                   <input 
                     type="text" 
                     placeholder="AMOR..."
                     value={commentAuthor}
                     onChange={(e) => setCommentAuthor(e.target.value)}
                     className="w-full bg-[#fcf9f2] border-[4px] border-black p-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] outline-none shadow-[4px_4px_0px_0px_#000] focus:translate-x-1 transition-transform"
                   />
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Sua Mensagem</label>
                     <textarea 
                       placeholder="SUSSURRE ALGO DOCE..."
                       value={newCommentText}
                       onChange={(e) => setNewCommentText(e.target.value)}
                       className="w-full bg-[#fcf9f2] border-[4px] border-black p-6 rounded-[2rem] font-black text-sm uppercase italic flex-1 min-h-[120px] resize-none outline-none shadow-[6px_6px_0px_0px_#000] focus:translate-y-1 transition-transform"
                     />
                  </div>
                  <button 
                    type="submit"
                    className="bg-black text-white px-10 py-6 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0px_0px_#4ade80] hover:-translate-y-2 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center cursor-pointer group/send"
                  >
                    <Send className="w-10 h-10 group-hover:rotate-12 transition-transform" strokeWidth={5} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface UploadModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  // ... and all the state setters
  title: string; setTitle: (v: string) => void;
  date: string; setDate: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  feeling: string; setFeeling: (v: string) => void;
  story: string; setStory: (v: string) => void;
  category: any; setCategory: (v: any) => void;
  theme: any; setTheme: (v: any) => void;
  useCustomUrl: boolean; setUseCustomUrl: (v: boolean) => void;
  inputUrl: string; setInputUrl: (v: string) => void;
  fileBase64: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
}

export function GalleryUploadModal({
  onClose,
  onSubmit,
  title, setTitle,
  date, setDate,
  location, setLocation,
  feeling, setFeeling,
  story, setStory,
  category, setCategory,
  theme, setTheme,
  useCustomUrl, setUseCustomUrl,
  inputUrl, setInputUrl,
  fileBase64,
  onFileChange,
  submitting
}: UploadModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white border-[6px] border-black rounded-[4rem] shadow-[20px_20px_0px_0px_#ff90e8] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        {/* Modal Header */}
        <div className="bg-black border-b-[6px] border-black p-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#ff90e8] rounded-[2.5rem] border-[4px] border-white flex items-center justify-center shadow-[6px_6px_0px_0px_#fff/20] rotate-3">
              <ImageIcon className="w-10 h-10 text-black" strokeWidth={5} />
            </div>
            <div>
              <h2 className="text-4xl font-black uppercase text-white tracking-tighter italic leading-none">Novo Registro</h2>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff90e8] mt-2">Transfira sua memória para o jardim eterno</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-all p-3 hover:text-[#ff90e8]"><X className="w-10 h-10" strokeWidth={5} /></button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-12 space-y-16 bg-[#fcf9f2]">
          {/* Step 1: Media Selection */}
          <section className="space-y-8">
            <div className="flex items-center gap-6 border-b-[5px] border-black pb-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black border-[3px] shadow-[4px_4px_0px_0px_#ff90e8]">1</div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Captura de Mídia</h3>
            </div>

            <div className="flex gap-6">
              <button 
                type="button" 
                onClick={() => setUseCustomUrl(true)}
                className={`flex-1 py-6 border-[4px] border-black rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-4 cursor-pointer active:translate-y-1 ${useCustomUrl ? 'bg-[#ff90e8] text-black shadow-[8px_8px_0px_0px_#000] -translate-y-1' : 'bg-white text-black/30 shadow-[4px_4px_0px_0px_#000]'}`}
              >
                <Link className="w-5 h-5" strokeWidth={4} /> Link da Web
              </button>
              <button 
                type="button" 
                onClick={() => setUseCustomUrl(false)}
                className={`flex-1 py-6 border-[4px] border-black rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-4 cursor-pointer active:translate-y-1 ${!useCustomUrl ? 'bg-[#4ade80] text-black shadow-[8px_8px_0px_0px_#000] -translate-y-1' : 'bg-white text-black/30 shadow-[4px_4px_0px_0px_#000]'}`}
              >
                <Upload className="w-5 h-5" strokeWidth={4} /> Do Arquivo
              </button>
            </div>

            <div className="p-12 border-[5px] border-dashed border-black/10 rounded-[4rem] bg-white flex flex-col items-center justify-center text-center shadow-inner group">
              {useCustomUrl ? (
                <div className="w-full space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/20 pl-4 text-left block">URL dA IMAGEM</label>
                    <div className="relative">
                      <Link className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" strokeWidth={4} />
                      <input 
                        type="text" 
                        placeholder="HTTPS://..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full pl-16 pr-6 py-6 border-[4px] border-black rounded-[2rem] font-mono text-xs shadow-[6px_6px_0px_0px_#000] focus:shadow-none focus:translate-x-1 outline-none transition-all"
                      />
                    </div>
                  </div>
                  {inputUrl && (
                    <div className="mt-6 w-56 h-56 mx-auto border-[5px] border-black rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_0px_#ff90e8] rotate-2">
                      <img src={inputUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <input type="file" id="fileInp" className="hidden" accept="image/*" onChange={onFileChange} />
                  <label htmlFor="fileInp" className="cursor-pointer block">
                    {fileBase64 ? (
                      <div className="w-full space-y-6">
                        <div className="w-56 h-56 mx-auto border-[5px] border-black rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_0px_#ff90e8] rotate-[-2deg]">
                          <img src={fileBase64} className="w-full h-full object-cover" alt="Local Preview" />
                        </div>
                        <span className="text-xs font-black uppercase text-[#ff90e8] tracking-[0.4em] underline">Mudar imagem</span>
                      </div>
                    ) : (
                      <div className="space-y-6 group-hover:scale-105 transition-transform">
                        <div className="w-24 h-24 bg-[#ff90e8]/10 border-[4px] border-black rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[8px_8px_0px_0px_#000]">
                          <Upload className="w-12 h-12 text-[#ff90e8]" strokeWidth={4} />
                        </div>
                        <div>
                          <p className="text-lg font-black uppercase italic tracking-tighter">Clique para selecionar</p>
                          <p className="text-[10px] font-black uppercase text-black/20 tracking-[0.2em] mt-2">JPEG/PNG ATÉ 2MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </section>

          {/* Step 2: Metadata */}
          <section className="space-y-10">
            <div className="flex items-center gap-6 border-b-[5px] border-black pb-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black border-[3px] shadow-[4px_4px_0px_0px_#4ade80]">2</div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Detalhes do Registro</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Título do Momento</label>
                <input 
                  type="text" 
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="EX: PIQUENIQUE..."
                  className="w-full border-[4px] border-black p-6 bg-white text-xs font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] focus:shadow-none outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Data da Emoção</label>
                <input 
                  type="text" 
                  value={date} onChange={e => setDate(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full border-[4px] border-black p-6 bg-white text-xs font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] focus:shadow-none outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Onde aconteceu?</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4ade80]" strokeWidth={4} />
                  <input 
                    type="text" 
                    value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="ONDE O AMOR ACONTECEU..."
                    className="w-full pl-16 pr-6 py-6 border-[4px] border-black bg-white text-xs font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] focus:shadow-none outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Filtro de Memória</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value as any)}
                  className="w-full border-[4px] border-black p-6 bg-white text-xs font-black uppercase rounded-[1.5rem] shadow-[6px_6px_0px_0px_#000] outline-none appearance-none cursor-pointer"
                >
                  <option value="❤️ Nossos Momentos">❤️ Nossos Momentos</option>
                  <option value="🌸 Datas Especiais">🌸 Datas Especiais</option>
                  <option value="✈️ Viagens">✈️ Viagens</option>
                  <option value="🎂 Comemorações">🎂 Comemorações</option>
                  <option value="😂 Momentos Engraçados">😂 Momentos Engraçados</option>
                  <option value="📷 Fotos Aleatórias">📷 Fotos Aleatórias</option>
                  <option value="🔒 Privadas">🔒 Privadas</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Narrativa da Alma</label>
              <textarea 
                rows={4}
                value={story} onChange={e => setStory(e.target.value)}
                placeholder="CONTE O QUE ACONTECEU..."
                className="w-full border-[5px] border-black p-8 bg-white text-sm font-black uppercase italic rounded-[3rem] shadow-[10px_10px_0px_0px_#000] focus:shadow-none outline-none resize-none"
              />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 pl-4">Moldura do Quadro</label>
              <div className="grid grid-cols-5 gap-4">
                {['cartoon', 'romance', 'anime', 'nature', 'vintage'].map(t => (
                  <button 
                    key={t}
                    type="button"
                    onClick={() => setTheme(t as any)}
                    className={`py-5 border-[4px] border-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${theme === t ? 'bg-black text-white shadow-[6px_6px_0px_0px_#4ade80] -translate-y-1' : 'bg-white text-black/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <footer className="pt-12 flex flex-col sm:flex-row gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-10 py-6 border-[4px] border-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-black/5 transition-all cursor-pointer"
            >
              Desistir
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white border-[4px] border-black py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.5em] shadow-[12px_12px_0px_0px_#ff90e8] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#ff90e8] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-6 cursor-pointer"
            >
              {submitting ? (
                <>Sincronizando... <Clock className="w-8 h-8 animate-spin" /></>
              ) : (
                <>Eternizar Agora ❤️</>
              )}
            </button>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
}
