"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createOrder } from "../_actions/create-order";
import { getPendingOrders } from "../_actions/get-orderPending";
import { removeOrderItem } from "../_actions/delete-orderItem";
import Header from "../components/header";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Trash } from "lucide-react";

export function CheckoutButton() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("retirada");
  const [cep, setCep] = useState("");
  const [shippingCost] = useState(0);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!userId) return;
  
    const fetchOrder = async () => {
      setLoading(true);
      const orders = await getPendingOrders({ userId });
      const pendingOrder = orders.find(order => order.status === "PENDING");
      setOrder(pendingOrder || null);
      setLoading(false);
    };
  
    fetchOrder();
  }, [userId]);
  

  const fetchOrder = async () => {
    setLoading(true);
    const orders = await getPendingOrders({ userId });
    const pendingOrder = orders.find(order => order.status === "PENDING");
    setOrder(pendingOrder || null);
    setLoading(false);
  };

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    await removeOrderItem({ userId, itemId });
    fetchOrder();
  };

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
        ...(deliveryMethod === "entrega" && { street, neighborhood, number, complement, cep }),
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

  return (
    <div>
      <Header />
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto mt-40">
        <div className={`md:w-1/2 p-6 bg-[#1e1e2e] shadow-lg rounded-lg transition-all duration-300 ${deliveryMethod === "retirada" ? "max-h-[200px]" : "max-h-[500px]"}`}>
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
              <Input placeholder="Digite seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
              <Input placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} className="mt-2" />
              <Input placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="mt-2" />
              <Input placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} className="mt-2" />
              <Input placeholder="Complemento (opcional)" value={complement} onChange={(e) => setComplement(e.target.value)} className="mt-2" />
            </div>
          )}
          <Button onClick={handleCheckout} disabled={loading || !userId} className="w-full mt-6 bg-[#d62828]">
            {loading ? "Carregando..." : userId ? "Pagar" : "Faça login para continuar"}
          </Button>
        </div>
        <div className="md:w-1/2 p-6 shadow-lg rounded-lg relative bg-[#1e1e2e]">
  <h2 className="text-xl font-semibold mb-4 text-white">Resumo do Pedido</h2>
  <div className="max-h-[300px] overflow-y-auto scrollbar-custom">
    <Table className="bg-[#2a2a3a] text-white w-full">
      <TableHeader className="sticky top-0 bg-[#2a2a3a] z-10">
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Qtd</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {order?.items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="flex items-center gap-2">{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>R$ {item.price.toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                <Trash size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  <p className="mt-4 text-white text-lg font-semibold">
    <p className="text-white mt-2">Frete: <span className="font-semibold text-red-500">R$ {shippingCost.toFixed(2)}</span></p>
    Total: <span className="text-green-400">R$ {order?.total?.toFixed(2)}</span>
  </p>
</div>

      </div>
    </div>
  );
}