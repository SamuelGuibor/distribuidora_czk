export default function Contato() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black p-6 rounded-lg shadow-lg">
        <h2 className="text-green-500 text-2xl font-bold text-center">Contato</h2>

        <label className="block text-green-400 mt-4">Nome:</label>
        <input
          type="text"
          placeholder="Seu nome"
          className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg"
        />

        <label className="block text-green-400 mt-4">E-mail:</label>
        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg"
        />

        <label className="block text-green-400 mt-4">Mensagem:</label>
        <textarea
          placeholder="Sua mensagem"
          className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg h-32"
        ></textarea>

        <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 mt-6 rounded-lg transition">
          ENVIAR
        </button>
      </div>
    </div>
  );
}
