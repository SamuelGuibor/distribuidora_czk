import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="home" className="w-full h-screen bg-black flex items-center justify-between px-[60px] text-white">
      <div className="max-w-[50%] space-y-[30px] text-left">
        <h1 className="text-[3rem] font-light relative left-[120px] font-[Shrikhand]">CZK BEER</h1>
        <p className="text-[1.2rem] leading-[1.8] w-[500px] relative left-[60px]">
          Somos uma distribuidora de bebidas comprometida em oferecer qualidade, 
          variedade e um atendimento diferenciado. Nosso objetivo é atender todos os tipos de clientes, 
          com um portfólio diversificado.
        </p>
        <Link href="/products">
          <button className="relative left-[140px] bg-[#00bf63] text-white px-5 py-2 rounded text-[18px] font-medium hover:bg-[#008f4c]">
            Ver Produtos
          </button>
        </Link>
      </div>
      <div className="max-w-[40%] text-center relative top-[40px] right-[70px]">
        <Image src="/balde.jpg" alt="Balde de Bebidas" width={500} height={500} />
      </div>
    </section>
  );
}
