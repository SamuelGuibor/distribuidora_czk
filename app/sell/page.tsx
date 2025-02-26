'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header2";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select";
import { Table } from "../components/ui/table";
import { getProducts } from "../_actions/get-product";
import { createSale } from "../_actions/create-sell";
import { getSale } from "../_actions/get-sale";
import { deleteSale } from "../_actions/delete-sale";
import { Trash2 } from "lucide-react";

export default function SalesEntry() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [value, setValue] = useState("");
  const [payment, setPayment] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({});
      setProducts(data);
    };

    const fetchSales = async () => {
      const data = await getSale();
      setSales(data);
    };

    fetchProducts();
    fetchSales();
  }, []);

  const handleAddSale = async () => {
    if (!product || !value || !payment) {
      console.log("Preencha todos os campos.");
      return;
    }

    const newSale = {
      id: crypto.randomUUID(),
      product,
      value: parseFloat(value),
      payment,
    };

    await createSale(newSale);
    setSales((prevSales) => [...prevSales, newSale]);
    setProduct("");
    setValue("");
    setPayment("");
  };

  const handleDeleteSale = async (id) => {
    await deleteSale(id);
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 pt-40">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-4 pt-2">Registrar Venda</h2>
            <div className="mb-4">
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    placeholder="Buscar produto..."
                    className="p-2 w-full mb-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {filteredProducts.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Input
                placeholder="Valor"
                type="number"
                value={value}
                className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Select value={payment} onValueChange={setPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"].map((method, index) => (
                    <SelectItem key={index} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddSale}>Adicionar Venda</Button>
          </CardContent>
        </Card>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Vendas Registradas</h3>
          <Table>
            <thead>
              <tr>
                <th className="p-2 text-left">Produto</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Pagamento</th>
                <th className="p-2 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-2">{sale.product}</td>
                  <td className="p-2 text-green-400">{Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(sale.value))}</td>
                  <td className="p-2">{sale.payment}</td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteSale(sale.id)} className="text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-6 flex items-center justify-end bg-gray-800 text-white text-sm rounded-md px-6 py-2 shadow-md w-fit">
            <span className="font-bold">Total de Vendas:</span>
            <span className="ml-2 text-green-400 font-semibold text-base">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(sales.reduce((total, sale) => total + Number(sale.value), 0))}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
