'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Header() {
  const router = useRouter();

  // Tipar corretamente os parâmetros e lidar com a navegação
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, path: string, targetId: string | null = null) => {
    e.preventDefault();
    if (path === "/") {
      // Navegar para a home e scrollar para a seção específica
      router.push(path);
      if (targetId) {
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offset = -119; // Ajuste para o header
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
          }
        }, 100); // Usar timeout para garantir que o router tenha navegado antes do scroll
      }
    } else {
      // Navegar para outras páginas
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
      <nav className="flex-1 flex relative right-8 justify-center gap-[30px]">
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

    </header>
  );
}
