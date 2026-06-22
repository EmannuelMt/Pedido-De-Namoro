import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CountersSection } from '../components/home/CountersSection';
import { HistorySection } from '../components/home/HistorySection';
import { GallerySection } from '../components/home/GallerySection';
import { AlbumsSection } from '../components/home/AlbumsSection';
import { PlaylistSection } from '../components/home/PlaylistSection';
import { NotesSection } from '../components/home/NotesSection';
import { CtaSection } from '../components/home/CtaSection';

export function Home() {
  const [daysTogether, setDaysTogether] = useState(0);
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [randomLoveMessage, setRandomLoveMessage] = useState<string | null>(null);

  const loveMessages = [
    "Prometo te amar nos dias de sol e de chuva... 🌧️❤️",
    "Você é a minha pessoa favorita no universo inteiro! 🌌✨",
    "Mais de 365 capítulos deliciosos ao seu lado, e isso é apenas o começo! 📖",
    "O seu sorriso é o meu papel de parede favorito do meu dia. 🥰🎨",
    "Você é o meu 'Perfect' de todas as horas, segundos e batimentos do peito. 🎵💍",
    "Eu amo cada pequeno detalhe em você, até as manias mais bobas e engraçadas. 🌻",
    "Meu coração bate em sincronia e harmonia eterna com o seu. 🧬💓",
    "Não importa o que aconteça no mundo lá fora, aqui dentro sempre seremos nós dois. 🔐🌍"
  ];

  const handleRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    setRandomLoveMessage(loveMessages[randomIndex]);
  };

  useEffect(() => {
    const startDate = new Date('2024-01-01T00:00:00');
    
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      setTimeTogether({ years, months, days, hours, minutes, seconds });
      
      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setDaysTogether(diffDays);
    };

    calculateTime();
    const timerInterval = setInterval(calculateTime, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className="space-y-40 pb-40 font-sans overflow-x-hidden bg-[#fcf9f2] min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto space-y-40">
        <CountersSection timeTogether={timeTogether} daysTogether={daysTogether} />
        <HistorySection />
        <GallerySection />
        <AlbumsSection />
        <PlaylistSection />
        <NotesSection 
          handleRandomMessage={handleRandomMessage}
          randomLoveMessage={randomLoveMessage}
          setRandomLoveMessage={setRandomLoveMessage}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
        />
        <CtaSection />
      </div>
    </div>
  );
}
