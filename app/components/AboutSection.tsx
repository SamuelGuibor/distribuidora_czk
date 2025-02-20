import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="min-h-[500px] md:h-[650px] bg-[#f4f4f4] text-black py-[40px] text-center px-4">
      <div className="max-w-[800px] mx-auto space-y-[20px] md:space-y-[30px]">
        <h2 className="text-[2rem] md:text-[2.7rem] font-bold text-[#00bf63]">Sobre Nós</h2>
        <Image 
          src="/image.png" 
          alt="Logo" 
          width={200} 
          height={200} 
          className="rounded-full mx-auto w-[150px] h-[150px] md:w-[200px] md:h-[200px]" 
        />
        <p className="text-[1.1rem] md:text-[1.3rem] leading-[1.6] md:leading-[1.8]">
          A Distribuidora CZK é referência no mercado de bebidas, oferecendo as melhores marcas e um atendimento personalizado.
          Estamos sempre prontos para atender as necessidades dos nossos clientes, sejam eles consumidores finais ou empresas.
        </p>
        <p className="text-[1.1rem] md:text-[1.3rem] leading-[1.6] md:leading-[1.8]">
          Nosso compromisso é com a qualidade, confiança e entrega rápida. Venha nos conhecer e descubra como podemos tornar seus momentos ainda mais especiais!
        </p>
      </div>
    </section>
  );
}