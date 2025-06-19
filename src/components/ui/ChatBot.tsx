'use client';
import { useState, useRef, useEffect } from 'react';
import { IoChatbubblesOutline, IoSend, IoClose, IoPersonCircleOutline, IoStorefrontOutline } from 'react-icons/io5';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQS = [
  {
    question: '¿Dónde está mi pedido?',
    answer: 'Puedes rastrear tu pedido desde la sección "Mis Órdenes". Si tienes dudas, ¡escríbenos aquí!'
  },
  {
    question: '¿Cuáles son los métodos de pago?',
    answer: 'Aceptamos PayPal y transferencias bancarias. Puedes elegir tu método favorito al finalizar la compra.'
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'El tiempo de entrega depende de tu ubicación, pero normalmente es de 2 a 5 días hábiles.'
  },
  {
    question: '¿Cómo puedo devolver un producto?',
    answer: 'Para devoluciones, contáctanos aquí con tu número de orden y te guiaremos en el proceso.'
  },
  {
    question: '¿Puedo modificar mi pedido?',
    answer: 'Si tu pedido aún no ha sido enviado, podemos ayudarte a modificarlo. ¡Escríbenos lo que necesitas!' 
  },
  {
    question: '¿Tienen atención al cliente?',
    answer: '¡Por supuesto! Nuestro equipo está disponible para ayudarte de lunes a viernes de 9am a 6pm.'
  }
];

const BOT_WELCOME = '¡Hola! Soy el asistente virtual de Momba Shop. ¿En qué puedo ayudarte hoy? Aquí tienes algunas preguntas frecuentes:';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: BOT_WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [showFaq, setShowFaq] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setShowFaq(false);
    setIsBotTyping(true);
    setTimeout(() => {
      const faq = FAQS.find(f => text.toLowerCase().includes(f.question.toLowerCase().slice(0, 8)));
      setIsBotTyping(false);
      if (faq) {
        setMessages(prev => [...prev, { from: 'bot', text: faq.answer }]);
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: '¡Gracias por tu mensaje! Un agente te responderá pronto o revisa nuestras preguntas frecuentes.' }]);
      }
    }, 900);
  };

  const handleFaqClick = (faq: typeof FAQS[0]) => {
    handleSend(faq.question);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-[#d64d04] hover:bg-orange-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all animate-bounce"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat"
        >
          <IoChatbubblesOutline className="w-7 h-7" />
        </button>
      )}
      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="w-full sm:max-w-md bg-white/90 rounded-t-2xl sm:rounded-2xl shadow-2xl mb-4 sm:mb-6 mr-0 sm:mr-6 flex flex-col h-[70vh] max-h-[500px] animate-fade-in-up border border-[#ffe6d4] backdrop-blur-md">
            {/* Header with gradient and online indicator */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#ffe6d4] via-[#fff7f0] to-[#f9fafb] rounded-t-2xl border-b">
              <div className="flex items-center gap-2">
                <IoStorefrontOutline className="text-[#d64d04] w-6 h-6" />
                <span className="font-bold text-lg text-gray-800">Momba Bot</span>
                <span className="ml-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-600 font-medium">online</span>
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            {/* Chat area with soft pattern */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-[url('data:image/svg+xml;utf8,<svg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><circle cx=\'1\' cy=\'1\' r=\'1\' fill=\'%23ffe6d4\' fill-opacity=\'0.18\'/></svg>')] bg-[#fff7f0]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex mb-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-[#d64d04] text-white rounded-br-md' : 'bg-white border text-gray-800 rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {isBotTyping && (
                <div className="flex mb-2 justify-start animate-fade-in">
                  <div className="rounded-2xl px-4 py-2 max-w-[80%] text-sm bg-white border text-gray-800 flex items-center gap-2 shadow rounded-bl-md">
                    <span className="inline-block w-2 h-2 bg-[#d64d04] rounded-full animate-bounce"></span>
                    <span className="inline-block w-2 h-2 bg-[#ffd4a6] rounded-full animate-bounce delay-100"></span>
                    <span className="inline-block w-2 h-2 bg-[#ffe6d4] rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              {showFaq && (
                <div className="mt-4">
                  <div className="font-semibold text-gray-700 mb-2">Preguntas frecuentes:</div>
                  <div className="flex flex-col gap-2">
                    {FAQS.map((faq, i) => (
                      <button
                        key={i}
                        className="text-left bg-white hover:bg-[#ffe6d4] rounded-xl px-3 py-2 text-sm transition flex items-center gap-2 shadow border border-[#ffe6d4]"
                        onClick={() => handleFaqClick(faq)}
                      >
                        <FaQuestionCircle className="text-[#d64d04] w-4 h-4" />
                        {faq.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!showFaq && (
                <div className="flex justify-center mt-4">
                  <button
                    className="px-4 py-2 rounded-full bg-[#ffe6d4] text-[#d64d04] font-semibold shadow hover:bg-[#ffd4a6] transition text-sm border border-[#ffd4a6]"
                    onClick={() => setShowFaq(true)}
                  >
                    Ver preguntas frecuentes
                  </button>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input area with shadow and gradient send button */}
            <form
              className="flex items-center gap-2 border-t px-4 py-3 bg-white rounded-b-2xl shadow-inner"
              onSubmit={e => {
                e.preventDefault();
                handleSend(input);
              }}
            >
              <input
                type="text"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d64d04] shadow-sm"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => setShowFaq(false)}
              />
              <button
                type="submit"
                className="bg-gradient-to-tr from-[#d64d04] to-[#ffd4a6] hover:from-orange-600 hover:to-[#ffe6d4] text-white rounded-full p-2 transition shadow-lg border border-[#ffd4a6]"
                aria-label="Enviar"
              >
                <IoSend className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
        .animate-fade-in-up {
          animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
} 