/* eslint-disable no-unused-vars */
'use client'
import { useEffect, useState } from "react"
import { getProducts } from "../_actions/get-product"
import { Product } from "@prisma/client"
import { FaCartPlus } from "react-icons/fa"
import Image from "next/image"
import { Button } from "./ui/button"

interface ProductListProps {
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

const ProductList = ({ searchQuery, onAddToCart }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsFromDb = await getProducts({ name: searchQuery })
        setProducts(productsFromDb)
      } catch (error) { 
        console.error("Erro ao carregar produtos:", error)
      }
    }
    fetchProducts()
  }, [searchQuery])

  return (
    <section className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="product bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="image-container w-full flex justify-center">
            <Image
              alt={product.name}
              src={product.imageUrl}
              width={150}
              height={150}
              className="rounded-lg object-cover w-full max-w-[150px]"
            />
          </div>
          <h4 className="font-bold text-[14px] mt-2 text-center">{product.name}</h4>
          <p className="text-sm text-gray-600 text-center">{product.description}</p>
          <p className="font-bold text-lg mt-2">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(product.price))}
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-3 flex items-center justify-center w-full max-w-[150px]"
            onClick={() => onAddToCart(product)}
          >
            <FaCartPlus size={17} className="mr-2" /> Adicionar
          </Button>
        </div>
      ))}
    </section>
  )
}

export default ProductList
