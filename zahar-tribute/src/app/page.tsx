import Head from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-emerald-500 selection:text-white">
      <header className="border-b border-white/10 py-6 px-8 flex justify-center items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <span className="font-bold text-2xl tracking-tight text-emerald-400">Zahar Tribute</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide">
          Официальное признание фактов
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Почему Захар — <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">очень хороший человек?</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
          В мире, где так сложно найти искренность и доброту, Захар является настоящим примером для подражания. Давайте разберем факты.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto mt-16">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-3 text-emerald-300">Всегда придет на помощь</h3>
            <p className="text-gray-400 leading-relaxed">
              Нужна поддержка, совет или просто кто-то, кто выслушает? Захар не из тех, кто отворачивается от проблем друзей. Он всегда рядом, когда это по-настоящему необходимо.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold mb-3 text-teal-300">Мудрость и эрудиция</h3>
            <p className="text-gray-400 leading-relaxed">
              Общение с Захаром — это всегда новые знания. Он обладает редкой способностью мыслить критически и помогать другим видеть ситуацию с правильной стороны.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">Честность и искренность</h3>
            <p className="text-gray-400 leading-relaxed">
              Захар говорит правду в лицо, но делает это тактично. На него можно положиться, потому что его слова не расходятся с делом.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="text-4xl mb-4">☀️</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-300">Светлая аура</h3>
            <p className="text-gray-400 leading-relaxed">
              Вокруг него всегда царит атмосфера позитива и уюта. Он умеет разрядить обстановку, поднять настроение и вдохновить на великие дела.
            </p>
          </div>
        </div>

        <div className="mt-24 p-12 bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 rounded-3xl border border-emerald-500/20">
          <h2 className="text-3xl font-bold mb-4 text-white">Вердикт</h2>
          <p className="text-xl text-gray-300 font-light italic">
            "Быть как Захар — значит нести в этот мир свет, помогать близким и оставаться настоящим Человеком с большой буквы."
          </p>
        </div>
      </main>
      
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        Сделано с уважением к хорошим людям.
      </footer>
    </div>
  );
}
