/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use client";

import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FaRegTrashAlt } from "react-icons/fa";

import { IoMdMore } from "react-icons/io";
import { Card, CardContent } from "../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "../components/header2";

const Dashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow text-white p-8 space-y-8 pt-24">
                <AccountsPayable />
            </div>
        </div>
    );
};

const AccountsPayable = () => {
    const [bills, setBills] = useState([
        { id: 1, fornecedor: "Fornecedor A", valor: 300.0, validade: "2025-02-10", pago: false },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newBill, setNewBill] = useState({ fornecedor: "", valor: "", validade: "", pago: false });
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const totalPaid = bills.reduce((acc, bill) => (bill.pago ? acc + bill.valor : acc), 0);
    const totalValue = bills.reduce((acc, bill) => (!bill.pago ? acc + bill.valor : acc), 0);

    const openModal = (type) => {
        setSelectedType(type);
        setNewBill({ fornecedor: "", valor: "", validade: "", pago: false });
        setShowModal(true);
    };

    const addBill = () => {
        setBills([...bills, { id: bills.length + 1, ...newBill, valor: parseFloat(newBill.valor) }]);
        setShowModal(false);
    };

    const togglePaymentStatus = (id) => {
        setBills(bills.map((bill) => (bill.id === id ? { ...bill, pago: !bill.pago } : bill)));
    };

    const deleteBill = (id) => {
        setBills(bills.filter((bill) => bill.id !== id));
    };


    return (
        <div className="container mx-auto p-4 pt-10">
            <Card className="h-[75vh] flex flex-col">
                <CardContent className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold pt-2">Contas a Pagar</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <IoMdMore size={30} className="cursor-pointer text-gray-300" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openModal("Manual")}>
                                    Adicionar Manualmente
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Tabela de contas */}
                    <div className="flex-grow overflow-y-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableCell className="w-1/4">Fornecedor</TableCell>
                                    <TableCell className="w-1/4">Valor</TableCell>
                                    <TableCell className="w-1/4">Validade</TableCell>
                                    <TableCell className="w-1/4 text-center">Status</TableCell>
                                    <TableCell className="w-1/6 text-right">Ação</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell className="w-1/4">{bill.fornecedor}</TableCell>
                                        <TableCell className="w-1/4">R$ {bill.valor.toFixed(2)}</TableCell>
                                        <TableCell className="w-1/4">{new Date(bill.validade).toLocaleDateString("pt-BR")}</TableCell>
                                        <TableCell
                                            className="w-1/4 cursor-pointer text-center"
                                            onClick={() => togglePaymentStatus(bill.id)}
                                        >
                                            <span className={bill.pago ? "text-green-500" : "text-red-500"}>
                                                {bill.pago ? "Pago" : "Não Pago"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="w-1/6 text-right">
                                            <FaRegTrashAlt
                                                size={20}
                                                className="cursor-pointer text-red-500 inline-block"
                                                onClick={() => deleteBill(bill.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>

                    {/* Resumo financeiro */}
                    <div className="mt-4 bg-gray-900 p-4 rounded-md text-lg font-semibold flex justify-between">
                        <p>Total de Despesas Gastas: <span className="text-green-500">R$ {totalPaid.toFixed(2)}</span></p>
                        <p>Total a Pagar: <span className="text-red-500">R$ {totalValue.toFixed(2)}</span></p>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de Adição */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-20">
                    <div className="bg-[#252830] p-6 rounded-md w-96">
                        <h2 className="text-xl font-semibold mb-4">Adicionar Conta ({selectedType})</h2>

                        {/* Select de Fornecedor */}
                        <Select onValueChange={(value) => setNewBill({ ...newBill, fornecedor: value })}>
                            <SelectTrigger className="w-full bg-gray-600 mb-2">
                                <SelectValue placeholder="Selecione um fornecedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fornecedor1">Fornecedor 1</SelectItem>
                                <SelectItem value="fornecedor2">Fornecedor 2</SelectItem>
                                <SelectItem value="fornecedor3">Fornecedor 3</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Input de Valor */}
                        <input
                            type="number"
                            placeholder="Valor"
                            className="w-full p-2 mb-2 bg-gray-600 rounded-md"
                            value={newBill.valor}
                            onChange={(e) => setNewBill({ ...newBill, valor: e.target.value })}
                        />

                        {/* Calendário */}
                        <div className="mb-2">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setNewBill({ ...newBill, validade: format(date, "yyyy-MM-dd") });
                                }}
                                locale={ptBR}
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <button onClick={addBill} className="bg-green-500 px-4 py-2 rounded-md mr-2">Salvar</button>
                            <button onClick={() => setShowModal(false)} className="bg-red-500 px-4 py-2 rounded-md">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
