import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Shirt, Sparkles, Ruler } from 'lucide-react';
import { CaimentAvatar } from '@/components/caiment/CaimentBubble';
import { Button } from '@/components/ui/Button';

const steps = [
  {
    icon: Ruler,
    title: 'Informe suas medidas',
    description: 'Envie fotos de corpo inteiro ou digite suas medidas manualmente.',
  },
  {
    icon: Scan,
    title: 'Gere seu avatar 3D',
    description: 'A Caiment prepara uma representação do seu corpo para experimentar roupas.',
  },
  {
    icon: Shirt,
    title: 'Experimente no provador',
    description: 'Veja como cada peça cai no seu avatar antes de decidir o tamanho.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-caiment-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl font-medium text-caiment-ink">
          <span className="italic">Meu</span>CAIMENT
        </span>
        <nav className="hidden items-center gap-8 text-sm font-medium text-caiment-ink-soft sm:flex">
          <a href="#como-funciona" className="hover:text-caiment-ink">Como funciona</a>
          <a href="#provador" className="hover:text-caiment-ink">Provador</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-caiment-ink-soft hover:text-caiment-ink">
            Entrar
          </Link>
          <Link to="/cadastro">
            <Button size="sm">Começar agora</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-20 pt-10 sm:pt-16">
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-caiment-purple-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-caiment-lime/20 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-caiment-purple-600 shadow-sm">
              <Sparkles size={13} /> Provador virtual inteligente
            </span>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-caiment-ink sm:text-5xl">
              Vista a roupa antes de comprar, direto no seu avatar 3D.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-caiment-ink-soft">
              O Caiment cria um avatar a partir das suas medidas e permite experimentar roupas
              virtualmente, com recomendação de tamanho para cada peça.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/cadastro">
                <Button size="lg" icon={<ArrowRight size={17} />} iconPosition="right">
                  Criar meu avatar
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
            <div className="animate-float rounded-[40px] bg-white p-6 shadow-2xl shadow-caiment-purple-900/10">
              <div className="flex items-center gap-3">
                <CaimentAvatar size={40} />
                <div>
                  <p className="text-sm font-medium text-caiment-ink">Caiment</p>
                  <p className="text-xs text-caiment-ink-soft">assistente do Caiment</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl rounded-tl-sm bg-caiment-purple-50 px-4 py-3">
                <p className="text-sm text-caiment-ink">
                  "Encontrei uma boa correspondência para esta peça — tamanho M."
                </p>
              </div>
              <div className="mt-4 aspect-[3/4] w-full rounded-3xl bg-gradient-to-b from-caiment-purple-100 to-caiment-purple-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-medium text-caiment-ink">Como funciona</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-3xl border border-caiment-line bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-50 text-caiment-purple-500">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-medium text-caiment-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-caiment-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[40px] bg-gradient-to-br from-caiment-purple-600 to-caiment-purple-800 px-8 py-14 text-center sm:px-16">
          <h2 className="font-display text-3xl font-medium text-white">Pronta para conhecer seu avatar?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Leva menos de cinco minutos para configurar seu perfil e começar a experimentar roupas.
          </p>
          <Link to="/cadastro" className="mt-7 inline-block">
            <Button variant="secondary" size="lg">
              Criar minha conta grátis
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-caiment-line px-6 py-8 text-center text-xs text-caiment-ink-soft">
        © 2026 CAIMENT. Todos os direitos reservados.
      </footer>
    </div>
  );
}
