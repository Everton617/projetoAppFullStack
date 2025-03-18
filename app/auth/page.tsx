"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import logo from '@/assets/img/logo.png';
import { toast } from "sonner"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const apiKeyValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdmVrc3V3YXNhd3d6bWh1aGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDQ1OTcsImV4cCI6MjA1NzgyMDU5N30.kSAYJLW12_LoYKHUJTv-6zzPrmsNKnn_Mf49i82f7G0';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
   
      const signupResponse = await fetch('https://ydveksuwasawwzmhuhew.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'apikey': apiKeyValue,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        alert(signupData.error.message || "Signup failed");
        return;
      }

   
      document.cookie = `access_token=${signupData.access_token}; path=/; max-age=3600`; 
      document.cookie = `refresh_token=${signupData.refresh_token}; path=/; max-age=86400`; 
      document.cookie = `user_id=${signupData.user.id}; path=/; max-age=86400`; 

    
      const createUserResponse = await fetch('https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': apiKeyValue,
          'Authorization': `Bearer ${signupData.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal', 
        },
        body: JSON.stringify({
          id: signupData.user.id,
          name: name,
          email: email,
        }),
      });

      if (!createUserResponse.ok) {
        throw new Error("Erro ao criar usuário na tabela");
      }

    
      toast.success("Conta criada com sucesso!", {
        style: {
          backgroundColor: "#4ade80", 
          color: "#ffffff",
          border: "none", 
          borderRadius: "8px", 
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("An error occurred during signup:", error);
      alert("An error occurred during signup");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://ydveksuwasawwzmhuhew.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'apikey': apiKeyValue,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
       
        document.cookie = `access_token=${data.access_token}; path=/; max-age=3600`;
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=86400`; 
        document.cookie = `user_id=${data.user.id}; path=/; max-age=86400`; 
        
        router.push('/dashboard');
        toast.success("Login efetuado com sucesso!", {
          style: {
            backgroundColor: "#4ade80", 
            color: "#ffffff", 
            border: "none",
            borderRadius: "8px", 
          },
        });
      } else {
        toast.error(data.error_description || "Login failed");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={logo} 
            alt="Logo"
            width={300} 
            height={100} 
            className="mb-6" 
          />
        </div>

        {/* Card de Login/Signup */}
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-orange-500 font-bold text-center">Bem Vindo</CardTitle>
            <CardDescription className="text-center">Entre com sua conta ou crie uma !</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full ">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="">Login</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Lembrar-me
                        </Label>
                      </div>
                      <a href="#" className="text-sm font-medium text-primary hover:underline">
                        Esqueceu a senha?
                      </a>
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 cursor-pointer hover:bg-orange-400">
                      Entrar
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 ">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input
                          id="firstName"
                          placeholder="Digite o seu nome"
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="min-w-[400px]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        placeholder="name@example.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Senha</Label>
                      <div className="relative">
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirme a senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 cursor-pointer">
                      Create Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}