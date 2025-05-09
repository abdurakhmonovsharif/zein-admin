"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Eye, Mail, MapPin, Pencil, Phone, Search } from "lucide-react"
import { useState } from "react"

// Интерфейс для клиента
interface Client {
  id: number
  name: string
  company: string
  email: string
  phone: string
  address: string
  studentsCount: number
  joinDate: string
  image: string
}

// Начальные данные для демонстрации
const initialClients: Client[] = [
  {
    id: 1,
    name: "ООО Образовательные Технологии",
    company: "EdTech Solutions",
    email: "info@edtech.ru",
    phone: "+7 (495) 123-45-67",
    address: "г. Москва, ул. Ленина, 10",
    studentsCount: 120,
    joinDate: "2022-01-15",
    image: "",
  },
  {
    id: 2,
    name: "Школа №1234",
    company: "Государственное образовательное учреждение",
    email: "school1234@edu.ru",
    phone: "+7 (495) 234-56-78",
    address: "г. Москва, ул. Пушкина, 25",
    studentsCount: 450,
    joinDate: "2022-03-10",
    image: "",
  },
  {
    id: 3,
    name: "Центр дополнительного образования 'Эрудит'",
    company: "ИП Смирнов А.В.",
    email: "erudit@mail.ru",
    phone: "+7 (495) 345-67-89",
    address: "г. Москва, пр. Мира, 100",
    studentsCount: 85,
    joinDate: "2022-05-20",
    image: "",
  },
  {
    id: 4,
    name: "Языковая школа 'Полиглот'",
    company: "ООО Лингва Плюс",
    email: "info@polyglot.ru",
    phone: "+7 (495) 456-78-90",
    address: "г. Москва, ул. Тверская, 15",
    studentsCount: 210,
    joinDate: "2022-07-05",
    image: "",
  },
  {
    id: 5,
    name: "Детский развивающий центр 'Умка'",
    company: "ИП Иванова Е.П.",
    email: "umka@gmail.com",
    phone: "+7 (495) 567-89-01",
    address: "г. Москва, ул. Садовая, 8",
    studentsCount: 65,
    joinDate: "2022-09-15",
    image: "",
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)

  // Фильтрация клиентов по поисковому запросу
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Получение инициалов из названия
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Обработчик редактирования клиента
  const handleEditClient = () => {
    if (currentClient) {
      setClients(clients.map((client) => (client.id === currentClient.id ? currentClient : client)))
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
                      <div>
                        <div className="font-medium">{client.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(client.joinDate)}</TableCell>
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
                        <span className="sr-only">Просмотр</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentClient(client)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Клиенты не найдены.
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
                  <AvatarImage src={currentClient.image || "/placeholder.svg"} alt={currentClient.name} />
                  <AvatarFallback className="text-lg">{getInitials(currentClient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{currentClient.name}</h2>
                  <p className="text-muted-foreground">{currentClient.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Контактная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{currentClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{currentClient.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Информация об аккаунте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Компания: {currentClient.company}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Количество студентов:</span>{" "}
                      <span className="font-medium">{currentClient.studentsCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Дата регистрации:</span>{" "}
                      <span className="font-medium">{formatDate(currentClient.joinDate)}</span>
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
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  value={currentClient.name}
                  onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Компания</Label>
                <Input
                  id="edit-company"
                  value={currentClient.company}
                  onChange={(e) => setCurrentClient({ ...currentClient, company: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentClient.email}
                  onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Телефон</Label>
                <Input
                  id="edit-phone"
                  value={currentClient.phone}
                  onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Адрес</Label>
                <Input
                  id="edit-address"
                  value={currentClient.address}
                  onChange={(e) => setCurrentClient({ ...currentClient, address: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-studentsCount">Количество студентов</Label>
                <Input
                  id="edit-studentsCount"
                  type="number"
                  min="0"
                  value={currentClient.studentsCount}
                  onChange={(e) =>
                    setCurrentClient({ ...currentClient, studentsCount: Number.parseInt(e.target.value) || 0 })
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
