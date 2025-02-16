export default function ContactSection() {
  return (
    <section id="contact" className="h-[650px] bg-black text-white py-[80px] text-center">
      <div className="max-w-[800px] mx-auto space-y-[30px]">
        <h2 className="text-[2.5rem] font-bold text-[#00bf63]">Contato</h2>
        <p className="text-[1.1rem] leading-[1.8]">
          Entre em contato conosco para dúvidas, sugestões ou pedidos. Estamos sempre à disposição!
        </p>
        <form className="space-y-[15px] max-w-[500px] mx-auto">
          <div className="flex flex-col text-left">
            <label htmlFor="name" className="text-[#00bf63] font-bold">Nome:</label>
            <input type="text" id="name" name="name" placeholder="Seu nome" required className="w-full p-[10px] border border-[#00bf63] rounded focus:outline-none focus:border-[#008f4c]" />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="email" className="text-[#00bf63] font-bold">E-mail:</label>
            <input type="email" id="email" name="email" placeholder="Seu e-mail" required className="w-full p-[10px] border border-[#00bf63] rounded focus:outline-none focus:border-[#008f4c]" />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="message" className="text-[#00bf63] font-bold">Mensagem:</label>
            <textarea id="message" name="message" placeholder="Sua mensagem"  required className="w-full p-[10px] border border-[#00bf63] rounded focus:outline-none focus:border-[#008f4c]"></textarea>
          </div>
          <button type="submit" className="bg-[#00bf63] hover:bg-[#008f4c] text-white px-6 py-2 rounded text-[18px] font-bold uppercase">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
