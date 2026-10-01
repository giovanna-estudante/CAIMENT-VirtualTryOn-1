import {
  ArrowRight,
  Search,
  ShoppingBag,
  UserRound,
  Heart,
} from 'lucide-react';

import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Camisetas',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Calças',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Vestidos',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Jaquetas',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
  },
];

const products = [
  {
    id: 1,
    name: 'Camiseta Essential',
    category: 'Camisetas',
    price: 129.9,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Calça Wide Leg',
    category: 'Calças',
    price: 249.9,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Vestido Serena',
    category: 'Vestidos',
    price: 289.9,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Jaqueta Urban',
    category: 'Jaquetas',
    price: 329.9,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
  },
];

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function FitsenseHomePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F8F7F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* LOGO */}
          <Link
            to="/fitsense"
            className="text-2xl font-semibold tracking-[-0.04em]"
          >
            FITSENSE
          </Link>

          {/* MENU */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/fitsense"
              className="text-sm font-medium transition hover:opacity-50"
            >
              Início
            </Link>

            <Link
              to="/fitsense/produtos"
              className="text-sm font-medium transition hover:opacity-50"
            >
              Produtos
            </Link>

            <Link
              to="/fitsense/produtos"
              className="text-sm font-medium transition hover:opacity-50"
            >
              Nova coleção
            </Link>

            <Link
              to="/fitsense/produtos"
              className="text-sm font-medium transition hover:opacity-50"
            >
              Ofertas
            </Link>
          </nav>

          {/* AÇÕES */}
          <div className="flex items-center gap-2">

            {/* PESQUISA */}
            <button
              type="button"
              aria-label="Pesquisar"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <Search size={19} strokeWidth={1.7} />
            </button>

            {/* CONTA → CADASTRO */}
            <Link
              to="/cadastro"
              aria-label="Criar minha conta"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>

            {/* FAVORITOS */}
            <button
              type="button"
              aria-label="Favoritos"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 sm:flex"
            >
              <Heart size={19} strokeWidth={1.7} />
            </button>

            {/* CARRINHO */}
            <Link
              to="/fitsense/carrinho"
              aria-label="Carrinho"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <ShoppingBag size={19} strokeWidth={1.7} />

              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </Link>

          </div>
        </div>
      </header>

      {/* HERO */}
      <main>

        <section className="mx-auto max-w-7xl px-5 pt-5 sm:px-8">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] bg-[#D9D4CC] sm:min-h-[650px]">

            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=90"
              alt="Nova coleção Fitsense"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

            <div className="relative flex min-h-[560px] max-w-xl flex-col justify-end p-8 pb-12 text-white sm:min-h-[650px] sm:p-14 sm:pb-16">

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                Nova coleção
              </p>

              <h1 className="max-w-lg text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-7xl">
                Vista o que combina com você.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Descubra peças pensadas para o seu estilo e experimente antes
                de comprar com o provador virtual Caiment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/fitsense/produtos"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:scale-[1.02] hover:bg-white/90"
                >
                  Explorar coleção
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/fitsense/produtos"
                  className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Ver novidades
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/45">
                Explore
              </p>

              <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                Categorias
              </h2>
            </div>

            <Link
              to="/fitsense/produtos"
              className="hidden items-center gap-2 text-sm font-semibold sm:flex"
            >
              Ver tudo
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">

            {categories.map((category) => (
              <Link
                key={category.name}
                to="/fitsense/produtos"
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#DDD8D0]"
              >

                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-lg font-medium text-white sm:text-xl">
                    {category.name}
                  </span>
                </div>

              </Link>
            ))}

          </div>
        </section>

        {/* PRODUTOS */}
        <section className="bg-white">

          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

            <div className="mb-10 flex items-end justify-between">

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/45">
                  Seleção Fitsense
                </p>

                <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                  Mais desejados
                </h2>
              </div>

              <Link
                to="/fitsense/produtos"
                className="hidden items-center gap-2 text-sm font-semibold sm:flex"
              >
                Ver todos
                <ArrowRight size={16} />
              </Link>

            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4 sm:gap-x-5">

              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/fitsense/produtos/${product.id}`}
                  className="group"
                >

                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F2F0EC]">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <button
                      type="button"
                      aria-label={`Adicionar ${product.name} aos favoritos`}
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition hover:bg-white"
                    >
                      <Heart size={16} strokeWidth={1.7} />
                    </button>

                  </div>

                  <div className="pt-4">

                    <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                      {product.category}
                    </p>

                    <h3 className="mt-1 text-sm font-medium sm:text-base">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm font-semibold">
                      {formatPrice(product.price)}
                    </p>

                  </div>

                </Link>
              ))}

            </div>
          </div>
        </section>

        {/* CAIMENT */}
        <section className="bg-[#171717] text-white">

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">

            <div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
                Tecnologia Fitsense
              </p>

              <h2 className="max-w-xl text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-6xl">
                Experimente antes de comprar.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                Com o Caiment, você pode visualizar como uma peça fica no seu
                avatar 3D antes de decidir comprar.
              </p>

              <Link
                to="/fitsense/produtos"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#171717] transition hover:bg-white/90"
              >
                Conhecer as peças
                <ArrowRight size={17} />
              </Link>

            </div>

            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#2A2A2A]">

              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
                alt="Experiência Fitsense"
                className="h-full w-full object-cover opacity-85"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <div className="absolute bottom-7 left-7 right-7">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">

                  <span className="h-2 w-2 rounded-full bg-[#C6F24E]" />

                  Powered by Caiment

                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#F8F7F4]">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xl font-semibold tracking-[-0.04em]">
              FITSENSE
            </p>

            <p className="mt-2 text-xs text-black/45">
              Moda que combina com você.
            </p>

          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium text-black/60">

            <Link
              to="/fitsense/produtos"
              className="transition hover:text-black"
            >
              Produtos
            </Link>

            <a
              href="#"
              className="transition hover:text-black"
            >
              Sobre nós
            </a>

            <a
              href="#"
              className="transition hover:text-black"
            >
              Atendimento
            </a>

            <a
              href="#"
              className="transition hover:text-black"
            >
              Privacidade
            </a>

          </div>
        </div>

        <div className="border-t border-black/5">

          <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-black/35 sm:px-8">
            © 2026 Fitsense. Todos os direitos reservados.
          </div>

        </div>

      </footer>

    </div>
  );
}