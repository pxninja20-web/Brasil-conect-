
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  Phone, 
  MessageSquare, 
  User, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  Coins,
  ArrowRightLeft,
  Settings,
  X,
  Send,
  Loader2,
  PhoneCall,
  History,
  AlertCircle
} from 'lucide-react';
import { Tab, Message, Call, UserProfile } from './types';
import { getAIHelp } from './services/gemini';

// --- Sub-components (Outside to prevent re-renders) ---

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-700 text-white">
    <div className="relative mb-6">
      <div className="h-24 w-24 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
      <Smartphone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10" />
    </div>
    <h1 className="text-2xl font-bold tracking-tight mb-2">BrasilConnect</h1>
    <p className="text-blue-100 animate-pulse">Iniciando conexão segura...</p>
  </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [profile, setProfile] = useState<UserProfile>({
    uid: 'user_777',
    socialId: 'BC-9921',
    virtualNumber: null,
    credits: 15,
    status: 'active'
  });
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'WhatsApp', text: 'Seu código de confirmação é: 482-192', timestamp: new Date(), isRead: false },
    { id: '2', sender: 'BrasilConnect', text: 'Bem-vindo! Seu número virtual está pronto para uso.', timestamp: new Date(Date.now() - 3600000), isRead: true }
  ]);

  const [calls, setCalls] = useState<Call[]>([]);
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Olá! Sou seu assistente BrasilConnect. Como posso te ajudar hoje?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerateNumber = async () => {
    if (profile.credits < 10) {
      alert("Créditos insuficientes! Assista um anúncio para ganhar mais.");
      return;
    }
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(r => setTimeout(r, 3000));
    const ddd = '11';
    const part1 = '9' + Math.floor(8000 + Math.random() * 1999);
    const part2 = Math.floor(1000 + Math.random() * 8999);
    const newNumber = `+55 (${ddd}) ${part1}-${part2}`;
    
    setProfile(prev => ({ ...prev, virtualNumber: newNumber, credits: prev.credits - 10 }));
    setIsGenerating(false);
  };

  const watchAd = () => {
    // Simulate ad watching
    const confirm = window.confirm("Assista este vídeo de 30s para ganhar 10 créditos?");
    if (confirm) {
      setLoading(true);
      setTimeout(() => {
        setProfile(prev => ({ ...prev, credits: prev.credits + 10 }));
        setLoading(false);
      }, 2000);
    }
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiThinking(true);
    
    const response = await getAIHelp(userMsg);
    setAiChat(prev => [...prev, { role: 'bot', text: response || 'Erro ao conectar com o servidor.' }]);
    setIsAiThinking(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-lg mx-auto border-x shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-blue-700 text-white pt-10 pb-6 px-6 relative shrink-0 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">BrasilConnect</h1>
              <span className="text-xs text-blue-200 font-medium tracking-wide">PREMIUM CONNECT</span>
            </div>
          </div>
          <button 
            onClick={watchAd}
            className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-yellow-300 transition-all active:scale-95 shadow-md"
          >
            <Coins className="w-4 h-4" /> {profile.credits} CR
          </button>
        </div>

        {!profile.virtualNumber ? (
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-sm font-semibold mb-1 opacity-80 uppercase tracking-widest">Ative sua linha</h2>
            <p className="text-2xl font-bold mb-4">Número Indisponível</p>
            <button 
              onClick={handleGenerateNumber}
              disabled={isGenerating}
              className="w-full bg-white text-blue-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5" />}
              {isGenerating ? 'GERANDO LINHA...' : 'GERAR NÚMERO (10 CR)'}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 border border-white/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xs font-bold mb-1 opacity-70 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Linha Ativa e Verificada
              </h2>
              <p className="text-3xl font-mono font-black text-white tracking-tighter mb-2">{profile.virtualNumber}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/30 text-green-100 text-[10px] rounded-full border border-green-500/20">Operadora: VIRTUAL_BR</span>
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] rounded-full border border-white/10">WhatsApp: PRONTO</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === Tab.HOME && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Ligações</h3>
                <p className="text-[10px] text-slate-500">Qualquer operadora do Brasil</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">WhatsApp</h3>
                <p className="text-[10px] text-slate-500">Ativação sem chip físico</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase opacity-60">Uso do Sistema</span>
                 </div>
                 <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">Atualizado agora</span>
               </div>
               <div className="flex items-end justify-between">
                 <div>
                    <p className="text-4xl font-bold tracking-tighter">1.2M+</p>
                    <p className="text-[10px] opacity-60">Pessoas conectadas no Brasil</p>
                 </div>
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-8 h-8 rounded-full border-2 border-slate-900" alt="User" />
                    ))}
                 </div>
               </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-3xl flex gap-3">
               <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
               <div>
                  <h4 className="font-bold text-orange-800 text-xs">Mantenha sua linha!</h4>
                  <p className="text-[10px] text-orange-700 leading-tight">Para não perder seu número, faça pelo menos uma chamada ou receba um SMS a cada 7 dias.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === Tab.CALLS && (
          <div className="h-full flex flex-col">
            <div className="bg-white rounded-3xl border p-4 shadow-sm mb-4">
              <input 
                type="tel" 
                placeholder="(00) 00000-0000"
                className="w-full text-3xl font-bold text-center py-6 focus:outline-none placeholder:text-slate-200"
              />
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n => (
                  <button key={n} className="h-16 flex items-center justify-center bg-slate-50 rounded-2xl text-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all">
                    {n}
                  </button>
                ))}
              </div>
              <button className="w-full h-16 bg-green-500 rounded-3xl flex items-center justify-center text-white shadow-lg hover:bg-green-600 active:scale-95 transition-all">
                <Phone className="w-8 h-8 fill-current" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 ml-2">Recentes</h3>
              <div className="space-y-2">
                {calls.length === 0 ? (
                  <div className="text-center py-10 text-slate-300">Nenhuma chamada recente</div>
                ) : (
                  calls.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{c.number}</p>
                          <p className="text-[10px] text-slate-500">{c.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <PhoneCall className="w-4 h-4 text-green-500" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.INBOX && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 px-2 mb-4">Mensagens</h2>
            {messages.map(msg => (
              <div key={msg.id} className={`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:border-blue-200 cursor-pointer ${!msg.isRead ? 'ring-1 ring-blue-500/20' : ''}`}>
                {!msg.isRead && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-blue-700 text-xs uppercase tracking-tighter">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === Tab.AI && (
          <div className="h-full flex flex-col bg-white rounded-3xl shadow-inner border overflow-hidden">
            <div className="bg-blue-50 p-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm">Assistente IA</h3>
                <span className="text-[10px] text-blue-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Online agora
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiChat.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                   <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-2 items-center bg-slate-50">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiSend()}
                placeholder="Diga algo..."
                className="flex-1 bg-white border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleAiSend}
                disabled={isAiThinking}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === Tab.PROFILE && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border text-center shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3">
                 <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Cidadão Conectado</h2>
              <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-widest">ID: {profile.socialId}</p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Créditos</p>
                    <p className="text-xl font-black text-blue-700">{profile.credits}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Plano</p>
                    <p className="text-xl font-black text-green-600">FREE</p>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
              {[
                { icon: <History className="w-5 h-5" />, label: 'Histórico de Créditos' },
                { icon: <ShieldCheck className="w-5 h-5" />, label: 'Privacidade e Segurança' },
                { icon: <Settings className="w-5 h-5" />, label: 'Configurações do App' },
                { icon: <ArrowRightLeft className="w-5 h-5" />, label: 'Portabilidade' }
              ].map((item, i) => (
                <button key={i} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 border-b last:border-0 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-300 rotate-45" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl border-t fixed bottom-0 left-0 right-0 max-w-lg mx-auto flex justify-around items-center px-4 py-3 z-40 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={activeTab === Tab.HOME} 
          onClick={() => setActiveTab(Tab.HOME)} 
          icon={<Smartphone />} 
          label="Início" 
        />
        <NavButton 
          active={activeTab === Tab.CALLS} 
          onClick={() => setActiveTab(Tab.CALLS)} 
          icon={<Phone />} 
          label="Chamadas" 
        />
        <div className="relative -top-10">
           <button 
             onClick={watchAd}
             className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white hover:scale-110 active:scale-95 transition-all"
           >
             <Plus className="w-8 h-8" />
           </button>
        </div>
        <NavButton 
          active={activeTab === Tab.INBOX} 
          onClick={() => setActiveTab(Tab.INBOX)} 
          icon={<MessageSquare />} 
          label="Inbox" 
        />
        <NavButton 
          active={activeTab === Tab.AI} 
          onClick={() => setActiveTab(Tab.AI)} 
          icon={<Sparkles />} 
          label="IA" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-1 rounded-lg transition-colors ${active ? 'bg-blue-50' : ''}`}>
      {/* Fix: use React.ReactElement<any> to resolve type error when cloning elements that accept className */}
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;
