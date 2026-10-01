import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownUp,
  ChevronDown,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

const products: Product[] = [
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
    name: 'Camiseta Urban',
    category: 'Camisetas',
    price: 149.9,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Camiseta Classic',
    category: 'Camisetas',
    price: 119.9,
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Calça Wide Leg',
    category: 'Calças',
    price: 249.9,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Calça Straight',
    category: 'Calças',
    price: 229.9,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Calça Tailored',
    category: 'Calças',
    price: 279.9,
    image:
      'https://images.unsplash.com/photo-1506629905607-d9f4c5a0d8c9?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 7,
    name: 'Vestido Serena',
    category: 'Vestidos',
    price: 289.9,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 8,
    name: 'Vestido Aura',
    category: 'Vestidos',
    price: 319.9,
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 9,
    name: 'Vestido Minimal',
    category: 'Vestidos',
    price: 259.9,
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 10,
    name: 'Jaqueta Urban',
    category: 'Jaquetas',
    price: 329.9,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 11,
    name: 'Jaqueta Classic',
    category: 'Jaquetas',
    price: 349.9,
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 12,
    name: 'Jaqueta Oversized',
    category: 'Jaquetas',
    price: 379.9,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
  },
];

const categories = [
  'Todos',
  'Camisetas',
  'Calças',
  'Vestidos',
  'Jaquetas',
];

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function FitsenseCatalogPage() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('relevancia');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== 'Todos') {
      result = result.filter(
        (product) => product.category === category,
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term),
      );
    }

    if (sort === 'menor-preco') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === 'maior-preco') {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === 'nome') {
      result.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    return result;
  }, [category, search, sort]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#171717]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F8F7F4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/fitsense"
            className="text-2xl font-semibold tracking-[-0.04em]"
          >
            FITSENSE
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/fitsense"
              className="text-sm font-medium transition hover:opacity-50"
            >
              Início
            </Link>

            <Link
              to="/fitsense/produtos"
              className="text-sm font-semibold"
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

          <div className="flex items-center gap-2">
            {/* PESQUISA */}
            <button
              aria-label="Pesquisar"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <Search size={19} strokeWidth={1.7} />
            </button>

            {/* CONTA → CADASTRO */}
            <Link
              to="/cadastro"
              aria-label="Criar minha conta"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 sm:flex"
            >
              <UserRound
                size={19}
                strokeWidth={1.7}
              />
            </Link>

            {/* CARRINHO */}
            <Link
              to="/fitsense/carrinho"
              aria-label="Carrinho"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <ShoppingBag
                size={19}
                strokeWidth={1.7}
              />

              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* TÍTULO */}
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
            Fitsense collection
          </p>

          <h1 className="text-5xl font-medium tracking-[-0.05em] sm:text-6xl">
            Todos os produtos
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-black/50 sm:text-base">
            Encontre peças para todos os momentos e descubra
            como elas ficam em você com o provador virtual
            Caiment.
          </p>
        </section>

        {/* BARRA DE BUSCA */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar produto..."
                className="h-12 w-full rounded-full border border-black/10 bg-white pl-11 pr-10 text-sm outline-none transition placeholder:text-black/35 focus:border-black/30"
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full hover:bg-black/5"
                  aria-label="Limpar busca"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={() =>
                setMobileFiltersOpen(!mobileFiltersOpen)
              }
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-medium sm:hidden"
            >
              <ArrowDownUp size={16} />
              Filtros
            </button>

            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="h-12 min-w-[190px] appearance-none rounded-full border border-black/10 bg-white pl-5 pr-11 text-sm font-medium outline-none"
              >
                <option value="relevancia">
                  Mais relevantes
                </option>

                <option value="menor-preco">
                  Menor preço
                </option>

                <option value="maior-preco">
                  Maior preço
                </option>

                <option value="nome">
                  Nome
                </option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </section>

        {/* FILTROS */}
        <section
          className={`mx-auto max-w-7xl px-5 sm:px-8 ${
            mobileFiltersOpen
              ? 'block'
              : 'hidden sm:block'
          }`}
        >
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setMobileFiltersOpen(false);
                    }}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-[#171717] text-white'
                        : 'bg-white text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-xs text-black/40">
                Ordenar:
              </span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="bg-transparent text-xs font-semibold outline-none"
              >
                <option value="relevancia">
                  Relevância
                </option>

                <option value="menor-preco">
                  Menor preço
                </option>

                <option value="maior-preco">
                  Maior preço
                </option>

                <option value="nome">
                  Nome
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* RESULTADOS */}
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pt-12">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-black/45">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'produto'
                : 'produtos'}
            </p>

            {search && (
              <p className="text-sm text-black/45">
                Busca por{' '}
                <span className="font-semibold text-black">
                  “{search}”
                </span>
              </p>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const isFavorite =
                  favorites.includes(product.id);

                return (
                  <Link
                    key={product.id}
                    to={`/fitsense/produtos/${product.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F0EEE9]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <button
                        type="button"
                        aria-label={
                          isFavorite
                            ? `Remover ${product.name} dos favoritos`
                            : `Adicionar ${product.name} aos favoritos`
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          toggleFavorite(product.id);
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition hover:bg-white"
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.7}
                          fill={
                            isFavorite
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>

                      <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-md">
                        Experimentar
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 sm:text-xs">
                        {product.category}
                      </p>

                      <h2 className="mt-1 text-sm font-medium sm:text-base">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-sm font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EEE9]">
                <Search size={22} />
              </div>

              <h2 className="text-2xl font-medium tracking-[-0.03em]">
                Nenhum produto encontrado
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-black/45">
                Tente procurar por outro nome ou categoria.
              </p>

              <button
                onClick={() => {
                  setSearch('');
                  setCategory('Todos');
                }}
                className="mt-6 rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/5 bg-[#F8F7F4]">
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
              to="/fitsense"
              className="transition hover:text-black"
            >
              Início
            </Link>

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