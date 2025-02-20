export default function PaymentSuccess() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-green-500 text-3xl font-bold">✅ Pagamento Aprovado!</h1>
        <p className="mt-2">Seu pagamento foi realizado com sucesso.</p>
        <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Voltar para a loja</a>
      </div>
    );
  }
  