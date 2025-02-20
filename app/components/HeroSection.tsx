import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="home" className="w-full min-h-screen bg-black flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-20 text-white py-10">
      
      {/* Texto à esquerda */}
      <div className="max-w-[600px] w-full text-center md:text-left space-y-6 px-4 md:px-0">
        <h1 className="text-3xl md:text-5xl font-bold font-[Shrikhand]">CZK BEER</h1>
        <p className="text-base md:text-lg leading-relaxed">
          Somos uma distribuidora de bebidas comprometida em oferecer qualidade, 
          variedade e um atendimento diferenciado. Nosso objetivo é atender todos os tipos de clientes, 
          com um portfólio diversificado.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link href="/products">
            <button className="bg-[#00bf63] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#008f4c] transition-all">
              Ver Produtos
            </button>
          </Link>
        </div>
      </div>

      {/* Imagem à direita (oculta no mobile) */}
      <div className="hidden md:block">
        <Image 
          src="/balde.jpg" 
          alt="Balde de Bebidas" 
          width={400} 
          height={400} 
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
