'use client'

import { useState, useEffect } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import * as yup from 'yup';

// Tipo para os usuários
type User = {
    id: string;
    name: string;
    email: string;
    endereco?: string;
    created_at: string;
    tipo?: number;
};


const userSchema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório').min(5, 'O nome deve ter pelo menos 5 caracteres'),
    email: yup.string().required('O email é obrigatório').email('Digite um email válido'),
});

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Omit<User, "id" | "created_at">>({
        name: "",
        email: "",
        endereco: ""
    });
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [filter, setFilter] = useState("");
    const [userRole, setUserRole] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
    
        const id = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_id='))
            ?.split('=')[1];
    
        setAccessToken(token || null);
        setUserId(id || null);
    }, []);

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const Authorization = `Bearer ${accessToken}`;

    const fetchUserRole = async () => {
        if (!apiKey || !Authorization || !userId) {
            console.error("Token de acesso, Authorization ou user_id não encontrado.");
            return;
        }
        try {
            const response = await fetch(
                `https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users?id=eq.${userId}`,
                {
                    headers: {
                        apikey: apiKey,
                        Authorization: Authorization,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar informações do usuário");
            }

            const data = await response.json();
            console.log(data)
            if (data.length > 0) {

                setUserRole(data[0].tipo);
            }
        } catch (error) {
            console.error("Erro ao buscar informações do usuário:", error);
        }
    };

    const fetchUsers = async () => {
        if (!apiKey || !Authorization) {
            console.error("Token de acesso ou Authorization não encontrado.");
            return;
        }
        try {
            const response = await fetch(
                "https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users?select=*",
                {
                    headers: {
                        apikey: apiKey,
                        Authorization: Authorization,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar usuários");
            }

            const data = await response.json();
            setUsers(data);
            //console.log(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUserRole();
    }, []);

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
        });
        setIsUserModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setCurrentUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!apiKey || !Authorization) {
            console.error("Token de acesso ou Authorization não encontrado.");
            return;
        }
        if (userRole !== 1) {
            toast.error("Apenas Administradores podem excluir usuários.", {
                style: {
                    backgroundColor: "#f87171",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                },
            });
            return;
        }
        if (currentUser) {
            try {
                const response = await fetch(
                    `https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users?id=eq.${currentUser.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            apikey: apiKey,
                            Authorization: Authorization,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao excluir usuário");
                }

                toast.success('Usuário deletado com sucesso!', {
                    style: {
                        backgroundColor: "#4ade80",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                    },
                });
                setUsers(users.filter((user) => user.id !== currentUser.id));
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
            }
        }
        setIsDeleteDialogOpen(false);
    };

    const handleSaveUser = async () => {
        if (userRole !== 1) {
            toast.error("Apenas Administradores podem editar usuários.", {
                style: {
                    backgroundColor: "#f87171",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                },
            });
            return;
        }
        try {

            await userSchema.validate(formData, { abortEarly: false });

            if (!apiKey || !Authorization) {
                console.error("Token de acesso ou Authorization não encontrado.");
                return;
            }

            if (currentUser) {
                const response = await fetch(
                    `https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users?id=eq.${currentUser.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            apikey: apiKey,
                            Authorization: Authorization,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao atualizar usuário");
                }

                setUsers(users.map((user) => (user.id === currentUser.id ? { ...user, ...formData } : user)));
                toast.success('Usuário atualizado com sucesso!', {
                    style: {
                        backgroundColor: "#4ade80",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                    },
                });
            }
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Exibe os erros de validação
                error.inner.forEach((err) => {
                    toast.error(err.message, {
                        style: {
                            backgroundColor: "#f87171",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                        },
                    });
                });
            } else {
                console.error("Erro ao salvar usuário:", error);
            }
        } finally {
            setIsUserModalOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditAddress = (user: User) => {
        setCurrentUser(user);
        setCep("");
        setEndereco(user.endereco || "");
        setIsAddressModalOpen(true);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCep(e.target.value);
    };

    const fetchAddressFromCep = async () => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error("Erro ao buscar endereço");
            }
            const data = await response.json();
            setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            toast.error("Erro ao buscar endereço. Verifique o CEP.", {
                style: {
                    backgroundColor: "#f87171",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                },
            });
        }
    };

    const handleSaveAddress = async () => {
        if (!currentUser) return;

        if (userRole !== 1) {
            toast.error("Apenas Administradores podem editar usuários.", {
                style: {
                    backgroundColor: "#f87171",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                },
            });
            return;
        }

        try {
            const response = await fetch(
                `https://ydveksuwasawwzmhuhew.supabase.co/rest/v1/users?id=eq.${currentUser.id}`,
                {
                    method: "PATCH",
                    headers: {
                        apikey: apiKey!,
                        Authorization: Authorization!,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ endereco }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar endereço");
            }

            setUsers(users.map((user) => (user.id === currentUser.id ? { ...user, endereco } : user)));
            toast.success('Endereço atualizado com sucesso!', {
                style: {
                    backgroundColor: "#4ade80",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                },
            });
        } catch (error) {
            console.error("Erro ao salvar endereço:", error);
        } finally {
            setIsAddressModalOpen(false);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className=" container mx-auto py-6 min-w-[440px] p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
                <div className="flex gap-4">
                    <Input
                        id="filter"
                        placeholder="Buscar por nome ou email..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-64"
                    />
                </div>
            </div>

            <div className="">
                <div className=" border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead>Data de Criação</TableHead>
                                <TableHead className="w-[100px] cursor-pointer text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.endereco ?? "Nenhum endereço cadastrado"}</TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className=" cursor-pointer" variant="ghost" size="sm">
                                                    Editar
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className=" cursor-pointer" onClick={() => handleEditUser(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="text-destructive focus:text-destructive  cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className=" cursor-pointer" onClick={() => handleEditAddress(user)}>
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    Editar Endereço
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Faça as alterações necessárias e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveUser}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário {currentUser?.name}? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Endereço</DialogTitle>
                        <DialogDescription>
                            Insira o CEP para buscar o endereço.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input id="cep" value={cep} onChange={handleCepChange} placeholder="00000-000" />
                            <Button className="bg-orange-400 cursor-pointer hover:bg-orange-300 max-w-[300px] mx-auto" onClick={fetchAddressFromCep}>Buscar Endereço</Button>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input id="endereco" value={endereco} readOnly />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-orange-400 hover:bg-orange-300 cursor-pointer" onClick={handleSaveAddress}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}