export default function PaymentFailure() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-red-500 text-3xl font-bold">❌ Pagamento Falhou!</h1>
        <p className="mt-2">Ocorreu um erro no seu pagamento. Tente novamente.</p>
        <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Tentar Novamente</a>
      </div>
    );
  }
  