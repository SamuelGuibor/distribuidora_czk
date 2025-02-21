"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { createOrder } from "../_actions/create-order";
import Header from "../components/header";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export function CheckoutButton() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("retirada");
  const [cep, setCep] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");

  const handleCheckout = async () => {
    if (!userId) {
      alert("Usuário não autenticado! Faça login para continuar.");
      return;
    }

    setLoading(true);

    try {
      const response = await createOrder({
        userId,
        paymentMethod: "MERCADO_PAGO",
        shippingCost,
        deliveryMethod,
        ...(deliveryMethod === "entrega" && {
          street,
          neighborhood,
          number,
          complement,
          cep,
        }),
      });

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        alert("Erro ao processar pagamento!");
      }
    } catch (error) {
      alert("Erro ao iniciar pagamento." + error);
    }

    setLoading(false);
  };

  const fetchAddressByCep = async () => {
    if (cep.length < 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado! Digite manualmente o endereço.");
        return;
      }

      setStreet(data.logradouro || "");
      setNeighborhood(data.bairro || "");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const calculateShipping = () => {
    if (deliveryMethod === "retirada") {
      setShippingCost(0);
      return;
    }

    const userCep = parseInt(cep.replace("-", ""));
    const baseCep = 82720050;
    const distance = Math.abs(userCep - baseCep) / 1000;

    setShippingCost(distance <= 5 ? 5 : 15);
  };

  return (
    <div>
      <Header />
      <div className="max-w-lg mx-auto p-6 bg-[#1e1e2e] shadow-lg rounded-lg mt-20 top-32 relative">
        <h2 className="text-xl font-semibold mb-4">Escolha o método de entrega</h2>
        <Select onValueChange={setDeliveryMethod} value={deliveryMethod}>
          <SelectTrigger className="w-full bg-[#2a2a3a]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retirada">Retirada</SelectItem>
            <SelectItem value="entrega">Entrega</SelectItem>
          </SelectContent>
        </Select>

        {deliveryMethod === "entrega" && (
          <div className="mt-4">
            <Input
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={() => {
                fetchAddressByCep();
                calculateShipping();
              }}
            />
            <p className="text-white mt-2">Frete: <span className="font-semibold">R$ {shippingCost.toFixed(2)}</span></p>

            <Input
              placeholder="Rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="mt-2"
            />
            <Input
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="mt-2"
            />
            <Input
              placeholder="Número"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="mt-2"
            />
            <Input
              placeholder="Complemento (opcional)"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        <div className="max-w-lg mx-auto p-6 bg-[#1e1e2e] shadow-lg rounded-lg mt-20 top-32 relative">
          <Button onClick={handleCheckout} disabled={loading || !userId} className="w-full mt-6 bg-[#d62828]">
            {loading ? "Carregando..." : userId ? "Pagar com Mercado Pago" : "Faça login para continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
