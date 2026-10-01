import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
} from 'lucide-react';

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

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function FitsenseCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('fitsense_cart');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem('fitsense_cart', JSON.stringify(cart));
  }, [cart, loaded]);

  function updateQuantity(
    id: number,
    size: string,
    color: string,
    change: number,
  ) {
    setCart((current) =>
      current.map((item) => {
        if (
          item.id === id &&
          item.size === size &&
          item.color === color
        ) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + change),
          };
        }

        return item;
      }),
    );
  }

  function removeItem(
    id: number,
    size: string,
    color: string,
  ) {
    setCart((current) =>
      current.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          ),
      ),
    );
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('fitsense_cart');
  }

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cart]);

  const shipping = subtotal >= 300 ? 0 : 19.9;
  const total = subtotal + shipping;

  const totalItems = cart.reduce(
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

          <Link
            to="/fitsense/carrinho"
            aria-label="Carrinho"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/5"
          >
            <ShoppingBag size={19} strokeWidth={1.7} />

            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {/* VOLTAR */}
        <Link
          to="/fitsense/produtos"
          className="inline-flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Continuar comprando
        </Link>

        {/* TÍTULO */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
            Fitsense
          </p>

          <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
            Seu carrinho
          </h1>

          <p className="mt-3 text-sm text-black/50">
            {totalItems === 0
              ? 'Seu carrinho está vazio.'
              : `${totalItems} ${
                  totalItems === 1
                    ? 'item selecionado'
                    : 'itens selecionados'
                }`}
          </p>
        </div>

        {cart.length === 0 ? (
          /* CARRINHO VAZIO */
          <div className="mt-12 flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] bg-white px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0EEE9]">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </div>

            <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em]">
              Seu carrinho está vazio
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/45">
              Explore a coleção Fitsense e encontre peças que
              combinam com você.
            </p>

            <Link
              to="/fitsense/produtos"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          /* CARRINHO COM PRODUTOS */
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* PRODUTOS */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="rounded-[1.5rem] bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* IMAGEM */}
                    <Link
                      to={`/fitsense/produtos/${item.id}`}
                      className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#ECEAE5] sm:h-40 sm:w-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </Link>

                    {/* INFORMAÇÕES */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
                            {item.category}
                          </p>

                          <Link
                            to={`/fitsense/produtos/${item.id}`}
                            className="mt-1 block text-base font-medium sm:text-lg"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.id,
                              item.size,
                              item.color,
                            )
                          }
                          aria-label={`Remover ${item.name}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/35 transition hover:bg-black/5 hover:text-black"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/50">
                        <span className="rounded-full bg-[#F5F4F1] px-3 py-1.5">
                          Tamanho: {item.size}
                        </span>

                        <span className="rounded-full bg-[#F5F4F1] px-3 py-1.5">
                          Cor: {item.color}
                        </span>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                        {/* QUANTIDADE */}
                        <div className="flex items-center rounded-full border border-black/10">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                -1,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-black/50 transition hover:text-black"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-7 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                1,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-black/50 transition hover:text-black"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-base font-semibold">
                          {formatPrice(
                            item.price * item.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* LIMPAR */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-black/40 transition hover:text-black"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>

            {/* RESUMO */}
            <aside>
              <div className="sticky top-28 rounded-[2rem] bg-white p-6 sm:p-7">
                <h2 className="text-xl font-medium tracking-[-0.03em]">
                  Resumo do pedido
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">
                      Frete
                    </span>

                    <span className="font-medium">
                      {shipping === 0
                        ? 'Grátis'
                        : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-black/10" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>

                {subtotal < 300 && (
                  <div className="mt-5 rounded-2xl bg-[#F4F1FC] p-4">
                    <p className="text-xs leading-5 text-[#5A2FB8]">
                      Faltam{' '}
                      <strong>
                        {formatPrice(300 - subtotal)}
                      </strong>{' '}
                      para você ganhar frete grátis.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Checkout será implementado na próxima etapa.',
                    )
                  }
                  className="mt-6 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] px-6 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Finalizar compra
                  <ArrowRightIcon />
                </button>

                <div className="mt-6 grid gap-3 border-t border-black/5 pt-5">
                  <div className="flex items-center gap-3 text-xs text-black/50">
                    <Truck size={16} />
                    Envio seguro
                  </div>

                  <div className="flex items-center gap-3 text-xs text-black/50">
                    <ShieldCheck size={16} />
                    Compra segura
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
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

function ArrowRightIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}