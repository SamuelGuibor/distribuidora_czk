"use client"
import { useState } from "react"
import { FaFilter, FaTimes } from "react-icons/fa"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão para abrir o filtro no mobile */}
      <button
        className="md:hidden flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg fixed top-40 left-4 z-50 "
        onClick={() => setIsOpen(true)}
      >
        <FaFilter /> Filtrar
      </button>

      {/* Sidebar principal */}
      <aside
        className={`sidebar bg-white shadow-md p-4 fixed md:static top-0 left-0 w-64 h-full md:h-auto z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Botão de fechar no mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-800"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-lg font-bold">Filtrar por</h3>

        <div className="filter mt-4">
          <h4 className="font-semibold">Categoria</h4>
          <label><input type="radio" name="categoria" value="alcoholic" defaultChecked /> Alcoólicas</label>
          <label><input type="radio" name="categoria" value="non-alcoholic" /> Não Alcoólicas</label>
          <label><input type="radio" name="categoria" value="snacks" /> Snacks</label>
          <label><input type="radio" name="categoria" value="desserts" /> Sobremesas</label>
        </div>

        <div className="filter mt-4">
          <h4 className="font-semibold">Preço</h4>
          <input type="range" min="0" max="2000" step="1" className="w-full" />
          <div className="text-sm text-gray-600">R$ 0 - R$ 2000</div>
        </div>

        <div className="filter mt-4">
          <h4 className="font-semibold">Marca</h4>
          <label><input type="checkbox" name="marca" value="marca1" /> Marca 1</label>
          <label><input type="checkbox" name="marca" value="marca2" /> Marca 2</label>
          <label><input type="checkbox" name="marca" value="marca3" /> Marca 3</label>
          <label><input type="checkbox" name="marca" value="marca4" /> Marca 4</label>
        </div>
      </aside>

      {/* Fundo escuro quando o menu está aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
