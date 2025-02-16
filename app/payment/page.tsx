/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { cancelOrder } from "../_actions/cancel-order"; // Importe a função corretamente

import { createOrder } from '../_actions/create-order';
import { useSession } from 'next-auth/react';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPixPaid, setIsPixPaid] = useState(false);
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [frete, setFrete] = useState(0);
  const [validade, setValidade] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');

  const router = useRouter();

  const { cartItems, getTotal } = useCart();

  const steps = ['Carrinho', 'Confirmação e Pagamento', 'Finalizar'];

  const handleCancelOrder = async () => {
    if (!userId) return;
  
    try {
      await cancelOrder(userId);
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
    }
  };
  const buscarEndereco = async (cep: string) => {
    if (!cep) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setRua('');
        alert('CEP não encontrado!');
      } else {
        setRua(data.logradouro || '');
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      alert('Erro ao buscar o endereço. Tente novamente.');
    }
  };

  const calculateFrete = async (cep: string) => {
    if (!cep) return;
    const freteCalculado = Math.random() * 20 + 10;
    setFrete(freteCalculado);
    await buscarEndereco(cep);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const { data: session } = useSession();
  const userId = session?.user?.id; // Pega o id do usuário da sessão

  const handleFinalizeOrder = async () => {
    if (!userId) {
      alert("Usuário não autenticado.");
      return;
    }

    const shippingCostValue = deliveryOption === "delivery" ? frete : 0;
    if (deliveryOption === "delivery" && shippingCostValue === 0) {
      alert("Erro: O valor do frete não foi definido corretamente.");
      return;
    }

    try {
      const order = await createOrder({
        userId,
        paymentMethod,
        shippingCost: shippingCostValue,
      });

      if (paymentMethod === "PIX") {
        alert("Aguardando confirmação do pagamento via PIX");
      } else {
        alert("Pedido concluído com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };


  const enderecoRetirada = "R. Clementina Kulik, 287 - Santa Cândida, Curitiba - PR, 82720-050";
  const horarioFuncionamento = `\nsegunda-feira 09:00–22:30 terça-feira 09:00–22:30\nquarta-feira 09:00–22:30 quinta-feira 09:00–22:30\nsexta-feira 09:00–22:30 sábado 10:00–22:00\ndomingo 10:00–22:00 `;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className='absolute left-10 top-10'>
        <ArrowLeft onClick={async () => {
          await handleCancelOrder();
          router.push("/products");
        }} className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>
      <Card className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-xl relative">
        <CardContent>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Processo de Checkout</h2>

          <div className="flex justify-between items-center mb-10">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-base font-medium ${index <= currentStep ? 'text-emerald-600' : 'text-gray-500'}`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${index < currentStep ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {currentStep === 0 && (
            <div className="space-y-6">
              <p className="text-lg font-medium text-gray-700">Verifique os itens no seu carrinho:</p>
              <div className="bg-gray-50 p-5 rounded-lg shadow-md space-y-3">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <p key={item.product.id} className="text-gray-800">
                      {item.product.name} - {item.quantity} x R${
                        Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.product.price))}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600">Seu carrinho está vazio.</p>
                )}
                <p className="font-semibold text-gray-900">Total: R${getTotal().toFixed(2)}</p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer shadow-md">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={() => setDeliveryOption('delivery')}
                    className="form-radio"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800">Entregar no endereço</p>
                  </div>
                </label>

                <label className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer shadow-md">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="pickup"
                    checked={deliveryOption === 'pickup'}
                    onChange={() => setDeliveryOption('pickup')}
                    className="form-radio"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800">Retirar no local</p>
                  </div>
                </label>
              </div>

              {deliveryOption === 'delivery' && (
                <div className="space-y-4">
                  <Input
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="p-3"
                  />
                  <Button
                    className="bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                    onClick={() => calculateFrete(cep)}
                  >
                    Calcular Frete
                  </Button>
                  <Input
                    placeholder="Rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    className="p-3"
                  />
                  <Input
                    placeholder="Bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="p-3"
                  />
                  <Input
                    placeholder="Número"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="p-3"
                  />
                  {frete > 0 && (
                    <p className="text-gray-800">Frete: R${frete.toFixed(2)}</p>
                  )}
                </div>
              )}

              <div className="space-y-6">
                <p className="text-lg font-medium text-gray-700">Escolha o método de pagamento:</p>
                <label className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer shadow-md">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-radio"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800">Pagar com Cartão de Crédito</p>
                  </div>
                </label>
                <label className="flex items-center space-x-4 border p-4 rounded-lg cursor-pointer shadow-md">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                    className="form-radio"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800">Pagar com Pix</p>
                  </div>
                </label>
              </div>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <p className="text-lg font-medium pt-2 text-gray-700">Insira os dados do cartão de crédito:</p>
                  <Input
                    placeholder="Número do Cartão"
                    className="p-3"
                    maxLength={19}
                    value={numeroCartao}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      value = value.match(/.{1,4}/g)?.join(' ') || value;
                      setNumeroCartao(value);
                    }}
                  />
                  <Input
                    value={nomeCartao}
                    placeholder="Nome no Cartão"
                    className="p-3"
                    onChange={(e) => setNomeCartao(e.target.value)}
                  />
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Validade (MM/AA)"
                      className="p-3"
                      maxLength={5}
                      value={validade}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setValidade(value);
                      }}
                    />
                    <Input
                      value={cvvCartao}
                      placeholder="CVV"
                      className="p-3"
                      maxLength={3}
                      pattern="\d*"
                      onChange={(e) => setCvvCartao(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-6">
              <p className="text-2xl font-semibold text-emerald-600">Obrigado pela sua compra!</p>
              <p className="text-lg font-medium text-gray-700">Total: R${(getTotal() + (deliveryOption === 'delivery' ? frete : 0)).toFixed(2)}</p>
              {paymentMethod === 'pix' && (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-lg font-medium text-gray-700">Escaneie o QR Code para pagar:</p>
                  {/* <img src="/path/to/qrcode.png" alt="QR Code Pix" className="w-40 h-40" /> */}
                  <Button
                    onClick={() => { setIsPixPaid(true); handleFinalizeOrder(); }}
                    className="bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Confirmar Pagamento
                  </Button>
                </div>
              )}
              {deliveryOption === 'pickup' ? (
                <div className="text-gray-700">
                  <p>Você escolheu retirar no local.</p>
                  <p><strong>Endereço:</strong> {enderecoRetirada}</p>
                  <p className="text-gray-700 whitespace-pre-line"><strong>Horario de funcionamento:</strong>{horarioFuncionamento}</p>
                </div>
              ) : (
                <p className="text-gray-700">Sua entrega será enviada para o endereço informado.</p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-10">
            <Button
              className={`px-6 py-3 rounded-lg font-medium ${currentStep === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Voltar
            </Button>
            <Button
              className={`px-6 py-3 rounded-lg font-medium ${cartItems.length === 0 && currentStep === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              onClick={handleNextStep}
              disabled={
                (cartItems.length === 0 && currentStep === 0) ||
                (currentStep === 1 && (
                  (deliveryOption === 'delivery' && (!bairro || !numero)) ||
                  (paymentMethod === 'card' && (!numeroCartao || !validade || !nomeCartao || !cvvCartao))
                )) ||
                (paymentMethod === 'pix' && currentStep === 2 && !isPixPaid)
              }
            >
              {currentStep < steps.length - 1 ? 'Próximo Passo' : 'Finalizar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;