/* eslint-disable no-unused-vars */

"use client";

import { useState, useEffect, useTransition } from "react";
import { getCategories, getFilteredProducts } from "../_actions/productaActions";
import { Product } from "@prisma/client";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { FaFilter } from "react-icons/fa";

interface SidebarProps {
  onFilter: (products: Product[]) => void;
}

export default function Sidebar({ onFilter }: SidebarProps) {
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCategories().then((fetchedCategories) => {
      console.log("Categorias carregadas:", fetchedCategories); // 🛠️ DEBUG
      setCategories(["Todas", ...fetchedCategories]);
    });
  }, []);

  const applyFilters = () => {
    startTransition(async () => {
      const [minPrice, maxPrice] = priceRange;
      const filteredProducts = await getFilteredProducts(
        selectedCategory !== "Todas" ? selectedCategory : undefined,
        minPrice,
        maxPrice
      );
      console.log("Produtos filtrados:", filteredProducts); // 🛠️ DEBUG
      onFilter(filteredProducts);
    });
  };

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Filtrar Produtos</h2>
        <FaFilter className="text-gray-500" />
      </div>

      {/* Seletor de Categoria */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Categoria</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className=" border-gray-300 rounded-md shadow-md">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="hover:bg-gray-100">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Preço */}
      <div className="mt-6">
        <label className="text-sm font-medium text-gray-700">Faixa de Preço</label>
        <Slider
          className="mt-2"
          min={0}
          max={2000}
          step={10}
          value={priceRange}
          onValueChange={(values) => setPriceRange(values as [number, number])}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>R$ {priceRange[0]}</span>
          <span>R$ {priceRange[1]}</span>
        </div>
      </div>

      {/* Botão de Aplicar Filtros */}
      <Button
        onClick={applyFilters}
        disabled={isPending}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? "Filtrando..." : "Aplicar Filtros"}
      </Button>
    </aside>
  );
}
