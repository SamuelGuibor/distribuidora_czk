'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, path: string, targetId: string | null = null) => {
    e.preventDefault();
    if (path === "/") {
      router.push(path);
      if (targetId) {
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offset = -119;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      router.push(path);
    }
  };

  return (
    <header className="fixed z-[10] top-0 left-0 w-full h-[120px] bg-[#00bf63] flex items-center justify-between px-[40px] sm:px-[60px]">
      {/* Logo (Escondida em telas pequenas) */}
      <div className="hidden sm:block">
        <Image src="/image.png" alt="Logo" width={100} height={100} className="rounded-full z-[200]" />
      </div>

      {/* Navigation Items (Agora mais à esquerda) */}
      <nav className="flex-1 flex justify-start sm:justify-center items-center gap-[15px] sm:gap-[30px] ml-[-10px] sm:ml-[40px]">
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#home")}
          className="text-black text-[15px] sm:text-[17px] uppercase font-bold hover:text-white whitespace-nowrap"
        >
          Início
        </Link>
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#about")}
          className="text-black text-[15px] sm:text-[17px] uppercase font-bold hover:text-white whitespace-nowrap"
        >
          Sobre Nós
        </Link>
        <Link
          href="/"
          onClick={(e) => handleNavigation(e, "/", "#contact")}
          className="text-black text-[15px] sm:text-[17px] uppercase font-bold hover:text-white whitespace-nowrap"
        >
          Contato
        </Link>
        <button
          onClick={(e) => handleNavigation(e, "/products")}
          className="text-black text-[15px] sm:text-[17px] uppercase font-bold hover:text-white whitespace-nowrap"
        >
          Produtos
        </button>
      </nav>
    </header>
  );
}
