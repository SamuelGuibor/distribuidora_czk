/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import ShoppingCart from "./Cart";
import SidebarSheet from "./SidebarSheet";
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Header() {
  const router = useRouter();
  const { isCartOpen, closeCart, openCart, toggleCart } = useCart();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string,
    targetId: string | null = null
  ) => {
    e.preventDefault();
    if (path === "/") {
      router.push(path);
      if (targetId) {
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offset = -119;
            const targetPosition =
              targetElement.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      router.push(path);
    }
  };

  return (
    <header className="fixed z-[10] top-0 left-0 w-full h-[120px] bg-[#00bf63] flex items-center justify-between px-[60px]">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/image.png" alt="Logo" width={100} height={100} className="rounded-full z-[200]" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex justify-center gap-[30px]">
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#home")}
          className="text-black text-[17px] uppercase font-bold hover:text-white"
        >
          Início
        </Link>
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#about")}
          className="text-black text-[17px] uppercase font-bold hover:text-white"
        >
          Sobre Nós
        </Link>
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#contact")}
          className="text-black text-[17px] uppercase font-bold hover:text-white"
        >
          Contato
        </Link>
        <button onClick={(e) => handleNavigation(e, "/products")} className="text-black text-[17px] uppercase font-bold hover:text-white">
          Produtos
        </button>
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* Cart Icon with Sheet */}
        <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
          <SheetTrigger>
            <button aria-label="Carrinho" className="text-black hover:text-white">
              <FaShoppingCart size={24} />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#f9f9f9] text-black" side="right">
            <SheetHeader>
              <h2 className="text-lg font-bold text-black">Carrinho</h2>
            </SheetHeader>
            <ShoppingCart />
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger>
          <button aria-label="Avatar" className="text-black hover:text-white">
              <FaUserCircle size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
            </SheetHeader>
            <SidebarSheet />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
