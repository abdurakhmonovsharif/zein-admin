"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClientRequest, useClientRequests } from "@/hooks/useClientRequest"
import { formatDate } from "@/lib/formatDate"
import {
  Eye,
  Phone,
  Search
} from "lucide-react"
import { useState } from "react"

export default function ClientsPage() {
  const {
    data: clients = [],
    isLoading,
    updateRequestMutation,
    deleteRequestMutation
  } = useClientRequests()

  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<ClientRequest | null>(null)

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)



  const handleEditClient = () => {
    if (currentClient) {
      updateRequestMutation.mutate(currentClient)
      setIsEditDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Клиенты</h1>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск клиентов..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead className="hidden md:table-cell">Телефон</TableHead>
              <TableHead className="hidden md:table-cell">Дата регистрации</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{client.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{client.phone_number}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentClient(client)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" onClick={() => deleteRequestMutation.mutate(client.id)}>
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {isLoading ? "Загрузка..." : "Клиенты не найдены."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог просмотра клиента */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Информация о клиенте</DialogTitle>
          </DialogHeader>
          {currentClient && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.avif" alt={currentClient.name} />
                  <AvatarFallback className="text-lg">{getInitials(currentClient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{currentClient.name}</h2>
                  <p className="text-muted-foreground">ID: {currentClient.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Контактная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{currentClient.phone_number}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Информация об аккаунте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Дата регистрации:</span>{" "}
                      <span className="font-medium">{formatDate(currentClient.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования клиента */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать клиента</DialogTitle>
            <DialogDescription>Измените информацию о клиенте</DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Имя</Label>
                <Input
                  id="edit-name"
                  value={currentClient.name}
                  onChange={(e) =>
                    setCurrentClient({ ...currentClient, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Телефон</Label>
                <Input
                  id="edit-phone"
                  value={currentClient.phone_number}
                  onChange={(e) =>
                    setCurrentClient({ ...currentClient, phone_number: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditClient} className="bg-[#7635E9] hover:bg-[#6025c7]">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
