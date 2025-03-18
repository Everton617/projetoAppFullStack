"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import logo from '@/assets/img/logo.png';

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];

    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleLogout = () => {

    document.cookie = 'access_token=';
    document.cookie = 'refresh_token=';
    setIsLoggedIn(false);

    window.location.href = "/auth";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 pl-10">
          <Image style={{ width: '200px', height: '' }} alt="" src={logo} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm text-orange-500 font-medium transition-colors hover:text-primary">
            Início
          </Link>
          <Link href="/sobre" className="text-sm text-orange-500 font-medium transition-colors hover:text-primary">
            Sobre
          </Link>
          <Link href="/servicos" className="text-sm text-orange-500 font-medium transition-colors hover:text-primary">
            Serviços
          </Link>
          <Link href="/contato" className="text-sm text-orange-500 font-medium transition-colors hover:text-primary">
            Contato
          </Link>

          {/* Botão de Entrar ou Dropdown de Usuário */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="bg-orange-500 cursor-pointer hover:bg-orange-300">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Deslogar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-orange-500 hover:bg-orange-300">Entrar</Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col mx-auto justify-center  text-center space-y-4 mt-8 items-center">
              <Link
                href="/"
                className="text-sm text font-medium text-white hover:text-primary bg-orange-500 hover:bg-orange-400 min-w-[100px] min-h-[30px] rounded-md flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/sobre"
                className="text-sm font-medium text-white hover:text-primary bg-orange-500 hover:bg-orange-400 min-w-[100px] min-h-[30px] rounded-md flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/servicos"
                className="text-sm font-medium text-white hover:text-primary bg-orange-500 hover:bg-orange-400 min-w-[100px] min-h-[30px] rounded-md flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                Serviços
              </Link>
              <Link
                href="/contato"
                className="text-sm font-medium text-white hover:text-primary bg-orange-500 hover:bg-orange-400 min-w-[100px] min-h-[30px] rounded-md flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                Contato
              </Link>
              {isLoggedIn ? (
                <Button onClick={handleLogout} className="min-w-[200px] bg-gray-500 hover:bg-gray-400 cursor-pointer">
                  Deslogar
                </Button>
              ) : (
                <Button className="w-full">Entrar</Button>
              )}
            </div>

          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}