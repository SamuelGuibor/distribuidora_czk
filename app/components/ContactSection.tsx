"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export default function Contato() {
  const formRef = useRef<HTMLFormElement>(null);
  const [telefone, setTelefone] = useState("");

  // Função para formatar o telefone no padrão (XX) XXXXX-XXXX
  const formatarTelefone = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 caracteres

    if (value.length <= 2) return `(${value}`;
    if (value.length <= 7) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = {
      nome: formRef.current.nome.value,
      email: formRef.current.email.value,
      telefone,
      mensagem: formRef.current.mensagem.value,
    };

    try {
      // 📩 Envia o e-mail para o CLIENTE (mensagem automática)
      await emailjs.send(
        "service_8iw08yo",   // Seu Service ID
        "template_fvfmqym",  // Template para o cliente
        formData,
        "8J3YxDCJPYd378iHp"  // Sua Public Key
      );

      // 📩 Envia o e-mail para o DONO DA EMPRESA (dados do cliente)
      await emailjs.send(
        "service_8iw08yo",   // Mesmo Service ID
        "template_g0vtp5s",  // Template para você (dono da empresa)
        formData,
        "8J3YxDCJPYd378iHp"  // Mesma Public Key
      );

      toast.success("Mensagem enviada com sucesso!");
      formRef.current.reset(); // Limpa o formulário após envio
      setTelefone(""); // Reseta o campo telefone também
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black p-6 rounded-lg shadow-lg">
        <h2 className="text-green-500 text-2xl font-bold text-center">Contato</h2>

        <form ref={formRef} onSubmit={handleSubmit}>
          <label className="block text-green-400 mt-4">Nome:</label>
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            required
            className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg"
          />

          <label className="block text-green-400 mt-4">E-mail:</label>
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg"
          />

          <label className="block text-green-400 mt-4">Telefone:</label>
          <input
            type="tel"
            name="telefone"
            placeholder="(XX) XXXXX-XXXX"
            required
            value={telefone}
            onChange={handleTelefoneChange}
            className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg"
          />

          <label className="block text-green-400 mt-4">Mensagem:</label>
          <textarea
            name="mensagem"
            placeholder="Sua mensagem"
            required
            className="w-full p-3 mt-1 border border-gray-600 bg-black text-white rounded-lg h-32"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 mt-6 rounded-lg transition"
          >
            ENVIAR
          </button>
        </form>
      </div>
    </div>
  );
}
