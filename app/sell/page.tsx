'use client'
import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header2";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "../components/ui/select";
import { Table } from "../components/ui/table";
import { Trash2 } from "lucide-react";

const productsList = ["Cerveja", "Refrigerante", "Água", "Suco"];
const paymentMethods = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"];

export default function SalesEntry() {
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState("");
  const [value, setValue] = useState("");
  const [payment, setPayment] = useState("");
  const [search, setSearch] = useState("");

  const handleAddSale = () => {
    console.log("Valores atuais:", { product, value, payment });
  
    if (!product || !value || !payment) {
      console.log("Preencha todos os campos.");
      return;
    }
  
    const newSale = { 
      id: sales.length + 1, 
      product, 
      value: parseFloat(value),  
      payment 
    };
  
    setSales((prevSales) => [...prevSales, newSale]);
  
    setProduct("");
    setValue("");
    setPayment("");
  };
  

  const handleDeleteSale = (id) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  const filteredProducts = productsList.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
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
                  {filteredProducts.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
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
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Select value={payment} onValueChange={setPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method, index) => (
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
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-2">{sale.product}</td>
                  <td className="p-2">R$ {sale.value.toFixed(2)}</td>
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
        </div>
      </div>
    </div>
  );
}