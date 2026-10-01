import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Ruler,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  clothingModel?: string;
  description: string;
  sizes: string[];
  colors: {
    name: string;
    value: string;
  }[];
  details: string[];
};

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Camiseta Essential',
    category: 'Camisetas',
    price: 129.9,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=90',
    clothingModel: '/models/camiseta-essential.glb',
    description:
      'Uma camiseta essencial para todos os dias. Modelagem confortável, visual minimalista e tecido macio para acompanhar diferentes combinações.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Branco', value: '#F5F5F2' },
      { name: 'Preto', value: '#171717' },
      { name: 'Cinza', value: '#A8A8A8' },
    ],
    details: [
      'Modelagem regular',
      'Tecido macio e confortável',
      'Gola redonda',
      'Composição: algodão',
    ],
  },

  {
    id: 2,
    name: 'Camiseta Urban',
    category: 'Camisetas',
    price: 149.9,
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=90',
    description:
      'Uma peça versátil para composições urbanas. Design contemporâneo com caimento confortável.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Off-white', value: '#E9E3D8' },
    ],
    details: [
      'Modelagem confortável',
      'Estilo urbano',
      'Tecido leve',
      'Gola redonda',
    ],
  },

  {
    id: 3,
    name: 'Camiseta Classic',
    category: 'Camisetas',
    price: 119.9,
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=1200&q=90',
    description:
      'Clássica e fácil de combinar. Uma peça básica pensada para fazer parte do seu guarda-roupa.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Branco', value: '#F4F4F0' },
    ],
    details: [
      'Modelagem regular',
      'Design minimalista',
      'Tecido confortável',
      'Uso casual',
    ],
  },

  {
    id: 4,
    name: 'Calça Wide Leg',
    category: 'Calças',
    price: 249.9,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=90',
    description:
      'Calça de modelagem ampla com visual moderno e confortável para diferentes ocasiões.',
    sizes: ['34', '36', '38', '40', '42', '44'],
    colors: [
      { name: 'Azul', value: '#263B5A' },
      { name: 'Preto', value: '#171717' },
    ],
    details: [
      'Modelagem wide leg',
      'Cintura confortável',
      'Bolsos laterais',
      'Tecido estruturado',
    ],
  },

  {
    id: 5,
    name: 'Calça Straight',
    category: 'Calças',
    price: 229.9,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=90',
    description:
      'Uma calça de corte reto que combina praticidade e estilo para o dia a dia.',
    sizes: ['34', '36', '38', '40', '42', '44'],
    colors: [
      { name: 'Azul', value: '#30476A' },
      { name: 'Preto', value: '#171717' },
    ],
    details: [
      'Corte reto',
      'Visual versátil',
      'Bolsos funcionais',
      'Tecido resistente',
    ],
  },

  {
    id: 6,
    name: 'Calça Tailored',
    category: 'Calças',
    price: 279.9,
    image:
      'https://images.unsplash.com/photo-1506629905607-d9f4c5a0d8c9?auto=format&fit=crop&w=1200&q=85',
    description:
      'Calça de inspiração alfaiataria com acabamento sofisticado e modelagem elegante.',
    sizes: ['36', '38', '40', '42', '44'],
    colors: [
      { name: 'Bege', value: '#C9B89E' },
      { name: 'Preto', value: '#171717' },
    ],
    details: [
      'Modelagem de alfaiataria',
      'Cintura média',
      'Acabamento sofisticado',
      'Bolsos laterais',
    ],
  },

  {
    id: 7,
    name: 'Vestido Serena',
    category: 'Vestidos',
    price: 289.9,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=90',
    description:
      'Vestido leve e elegante, pensado para criar um visual marcante sem abrir mão do conforto.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Vinho', value: '#63343D' },
    ],
    details: [
      'Modelagem fluida',
      'Tecido leve',
      'Comprimento midi',
      'Acabamento delicado',
    ],
  },

  {
    id: 8,
    name: 'Vestido Aura',
    category: 'Vestidos',
    price: 319.9,
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    description:
      'Uma peça sofisticada com linhas minimalistas para ocasiões especiais.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Creme', value: '#E8DFD0' },
    ],
    details: [
      'Modelagem elegante',
      'Design minimalista',
      'Tecido confortável',
      'Acabamento premium',
    ],
  },

  {
    id: 9,
    name: 'Vestido Minimal',
    category: 'Vestidos',
    price: 259.9,
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
    description:
      'Design minimalista e atemporal para quem prefere peças fáceis de combinar.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Branco', value: '#F2EFE8' },
    ],
    details: [
      'Design minimalista',
      'Modelagem confortável',
      'Tecido leve',
      'Estilo atemporal',
    ],
  },

  {
    id: 10,
    name: 'Jaqueta Urban',
    category: 'Jaquetas',
    price: 329.9,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    description:
      'Jaqueta versátil com visual urbano e estrutura confortável para os dias mais frios.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Marrom', value: '#6B5143' },
    ],
    details: [
      'Modelagem regular',
      'Fechamento frontal',
      'Bolsos laterais',
      'Estrutura confortável',
    ],
  },

  {
    id: 11,
    name: 'Jaqueta Classic',
    category: 'Jaquetas',
    price: 349.9,
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=85',
    description:
      'Uma jaqueta clássica para complementar produções casuais e sofisticadas.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Caramelo', value: '#A87852' },
    ],
    details: [
      'Design clássico',
      'Modelagem confortável',
      'Bolsos frontais',
      'Acabamento resistente',
    ],
  },

  {
    id: 12,
    name: 'Jaqueta Oversized',
    category: 'Jaquetas',
    price: 379.9,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    description:
      'Jaqueta oversized com personalidade e visual contemporâneo.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', value: '#171717' },
      { name: 'Cinza', value: '#777777' },
    ],
    details: [
      'Modelagem oversized',
      'Visual contemporâneo',
      'Bolsos funcionais',
      'Tecido estruturado',
    ],
  },
];

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function getCart(): CartItem[] {
  const savedCart = localStorage.getItem('fitsense_cart');

  if (!savedCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export default function FitsenseProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedSize, setSelectedSize] =
    useState<string | null>(null);

  const [selectedColor, setSelectedColor] =
    useState(0);

  const [imageLoaded, setImageLoaded] =
    useState(false);

  const productId = Number(id);

  const product =
    products.find((item) => item.id === productId) ??
    products[0];

  function handleTryOn() {
    if (!selectedSize) {
      alert('Selecione um tamanho antes de experimentar.');
      return;
    }

    const selectedProduct = {
      id: String(product.id),
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[selectedColor].name,
      clothingModel: product.clothingModel,
    };

    /*
     * Guardamos a peça escolhida para que,
     * depois do cadastro/login, o Caiment possa
     * recuperar a roupa que o usuário queria experimentar.
     */
    sessionStorage.setItem(
      'caiment_selected_product',
      JSON.stringify(selectedProduct),
    );

    /*
     * FLUXO PRINCIPAL:
     *
     * Fitsense
     *   ↓
     * Produto
     *   ↓
     * Experimentar no Caiment
     *   ↓
     * Cadastro
     */
    navigate('/cadastro');
  }

  function handleAddToCart() {
    if (!selectedSize) {
      alert('Selecione um tamanho antes de adicionar ao carrinho.');
      return;
    }

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[selectedColor].name,
      quantity: 1,
    };

    const cart = getCart();

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.size === newItem.size &&
        item.color === newItem.color,
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity:
          cart[existingItemIndex].quantity + 1,
      };
    } else {
      cart.push(newItem);
    }

    localStorage.setItem(
      'fitsense_cart',
      JSON.stringify(cart),
    );

    navigate('/fitsense/carrinho');
  }

  const cartQuantity = getCart().reduce(
    (total, item) => total + item.quantity,
    0,
  );

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

          <div className="flex items-center gap-2">

            <Link
              to="/cadastro"
              aria-label="Criar minha conta"
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <UserIcon />
            </Link>

            <Link
              to="/fitsense/carrinho"
              aria-label="Carrinho"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <ShoppingBag
                size={19}
                strokeWidth={1.7}
              />

              {cartQuantity > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-semibold text-white">
                  {cartQuantity}
                </span>
              )}

            </Link>

          </div>

        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">

        <Link
          to="/fitsense/produtos"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-black/55 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Voltar para produtos
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* IMAGEM */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#ECEAE5]">

              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[#E5E2DC]" />
              )}

              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={`h-full w-full object-cover transition duration-700 ${
                  imageLoaded
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
              />

            </div>
          </div>

          {/* INFORMAÇÕES */}
          <div className="flex flex-col">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-xl font-semibold">
              {formatPrice(product.price)}
            </p>

            <div className="my-7 h-px bg-black/10" />

            <p className="text-sm leading-7 text-black/60 sm:text-base">
              {product.description}
            </p>

            {/* COR */}
            <div className="mt-8">

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold">
                  Cor
                </p>

                <p className="text-sm text-black/45">
                  {product.colors[selectedColor].name}
                </p>

              </div>

              <div className="mt-4 flex gap-3">

                {product.colors.map(
                  (color, index) => (
                    <button
                      type="button"
                      key={color.name}
                      onClick={() =>
                        setSelectedColor(index)
                      }
                      aria-label={`Selecionar cor ${color.name}`}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
                        selectedColor === index
                          ? 'border-black'
                          : 'border-black/10'
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-black/10"
                        style={{
                          backgroundColor:
                            color.value,
                        }}
                      />

                      {selectedColor === index && (
                        <span className="absolute inset-[-4px] rounded-full border border-black" />
                      )}

                    </button>
                  ),
                )}

              </div>
            </div>

            {/* TAMANHO */}
            <div className="mt-8">

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold">
                  Tamanho
                </p>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-black/50 transition hover:text-black"
                >
                  <Ruler size={14} />
                  Guia de tamanhos
                </button>

              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">

                {product.sizes.map((size) => {

                  const selected =
                    selectedSize === size;

                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`flex h-12 items-center justify-center rounded-xl border text-sm font-medium transition ${
                        selected
                          ? 'border-[#5A2FB8] bg-[#5A2FB8] text-white'
                          : 'border-black/10 bg-white hover:border-black/30'
                      }`}
                    >
                      {size}
                    </button>
                  );

                })}

              </div>
            </div>

            {/* BOTÕES */}
            <div className="mt-8 flex flex-col gap-3">

              {/* EXPERIMENTAR NO CAIMENT */}
              <button
                type="button"
                onClick={handleTryOn}
                className="group relative flex min-h-[62px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#472494] via-[#6E42D1] to-[#8862DD] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(90,47,184,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(90,47,184,0.35)]"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Sparkles size={18} />
                </span>

                <span>
                  Experimentar no Caiment
                </span>

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              {/* CARRINHO */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#171717] px-6 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                Adicionar ao carrinho
              </button>

            </div>

            {/* CAIMENT */}
            <div className="mt-5 rounded-2xl border border-[#CDBEF2] bg-[#F4F1FC] p-4">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6E42D1] text-white">
                  <Sparkles size={16} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-[#341A6E]">
                    Experimente virtualmente
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6E6580]">
                    Veja esta peça no seu avatar 3D
                    através do provador virtual
                    Caiment antes de comprar.
                  </p>

                </div>

              </div>

            </div>

            {/* INFORMAÇÕES */}
            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-black/5 bg-white p-4">

                <Truck
                  size={18}
                  className="mb-3"
                />

                <p className="text-xs font-semibold">
                  Envio seguro
                </p>

                <p className="mt-1 text-[11px] leading-5 text-black/40">
                  Acompanhe seu pedido.
                </p>

              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4">

                <Check
                  size={18}
                  className="mb-3"
                />

                <p className="text-xs font-semibold">
                  Compra segura
                </p>

                <p className="mt-1 text-[11px] leading-5 text-black/40">
                  Seus dados protegidos.
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* DETALHES */}
        <section className="mt-20 border-t border-black/10 pt-12 sm:mt-28">

          <div className="grid gap-10 md:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
                Sobre a peça
              </p>

              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                Detalhes
              </h2>

            </div>

            <div>

              <div className="divide-y divide-black/10">

                {product.details.map(
                  (detail) => (
                    <div
                      key={detail}
                      className="flex items-center gap-3 py-4 text-sm text-black/65"
                    >
                      <Check
                        size={15}
                        className="shrink-0"
                      />

                      {detail}
                    </div>
                  ),
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-black/5 bg-[#F8F7F4]">

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

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c.8-4 3.1-6 7-6s6.2 2 7 6" />
    </svg>
  );
}