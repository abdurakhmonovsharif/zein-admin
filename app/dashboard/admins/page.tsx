"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Pencil, Trash2, ShieldCheck } from "lucide-react"

// Интерфейс для администратора
interface Admin {
  id: number
  name: string
  email: string
  role: "admin" | "superadmin"
  lastLogin: string
  status: "active" | "inactive"
  image: string
}

// Начальные данные для демонстрации
const initialAdmins: Admin[] = [
  {
    id: 1,
    name: "Администратор",
    email: "admin@zein.edu",
    role: "superadmin",
    lastLogin: "2023-05-15T10:30:00",
    status: "active",
    image: "",
  },
  {
    id: 2,
    name: "Иван Петров",
    email: "ivan@zein.edu",
    role: "admin",
    lastLogin: "2023-05-14T14:45:00",
    status: "active",
    image: "",
  },
  {
    id: 3,
    name: "Мария Сидорова",
    email: "maria@zein.edu",
    role: "admin",
    lastLogin: "2023-05-10T09:15:00",
    status: "active",
    image: "",
  },
  {
    id: 4,
    name: "Алексей Иванов",
    email: "alexey@zein.edu",
    role: "admin",
    lastLogin: "2023-05-05T16:20:00",
    status: "inactive",
    image: "",
  },
]

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })
  const [passwordError, setPasswordError] = useState("")

  // Фильтрация администраторов по поисковому запросу
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Получение инициалов из имени
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Форматирование даты последнего входа
  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Обработчик добавления нового администратора
  const handleAddAdmin = () => {
    // Проверка совпадения паролей
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setPasswordError("Пароли не совпадают")
      return
    }

    const admin: Admin = {
      id: admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role as "admin" | "superadmin",
      lastLogin: new Date().toISOString(),
      status: "active",
      image: "",
    }
    setAdmins([...admins, admin])
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    })
    setPasswordError("")
    setIsAddDialogOpen(false)
  }

  // Обработчик редактирования администратора
  const handleEditAdmin = () => {
    if (currentAdmin) {
      setAdmins(admins.map((admin) => (admin.id === currentAdmin.id ? currentAdmin : admin)))
      setIsEditDialogOpen(false)
    }
  }

  // Обработчик удаления администратора
  const handleDeleteAdmin = () => {
    if (currentAdmin) {
      setAdmins(admins.filter((admin) => admin.id !== currentAdmin.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Администраторы</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#7635E9] hover:bg-[#6025c7]">
          <Plus className="mr-2 h-4 w-4" /> Добавить администратора
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск администраторов..."
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
              <TableHead>Администратор</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead className="hidden md:table-cell">Последний вход</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={admin.image || "/placeholder.svg"} alt={admin.name} />
                        <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-xs text-muted-foreground">{admin.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.role === "superadmin" ? "default" : "outline"}
                      className="flex items-center gap-1 w-fit"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {admin.role === "superadmin" ? "Суперадмин" : "Админ"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatLastLogin(admin.lastLogin)}</TableCell>
                  <TableCell>
                    <Badge variant={admin.status === "active" ? "default" : "secondary"} className="w-fit">
                      {admin.status === "active" ? "Активен" : "Неактивен"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentAdmin(admin)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentAdmin(admin)
                          setIsDeleteDialogOpen(true)
                        }}
                        disabled={admin.role === "superadmin"} // Запрещаем удалять суперадмина
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Администраторы не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог добавления администратора */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить администратора</DialogTitle>
            <DialogDescription>Заполните информацию о новом администраторе</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Введите ФИО администратора"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="Введите email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={newAdmin.password}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                  setPasswordError("")
                }}
                placeholder="Введите пароль"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newAdmin.confirmPassword}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                  setPasswordError("")
                }}
                placeholder="Подтвердите пароль"
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="superadmin">Суперадминистратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleAddAdmin}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={!newAdmin.name || !newAdmin.email || !newAdmin.password || !newAdmin.confirmPassword}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования администратора */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать администратора</DialogTitle>
            <DialogDescription>Измените информацию об администраторе</DialogDescription>
          </DialogHeader>
          {currentAdmin && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">ФИО</Label>
                <Input
                  id="edit-name"
                  value={currentAdmin.name}
                  onChange={(e) => setCurrentAdmin({ ...currentAdmin, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentAdmin.email}
                  onChange={(e) => setCurrentAdmin({ ...currentAdmin, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Роль</Label>
                <Select
                  value={currentAdmin.role}
                  onValueChange={(value) => setCurrentAdmin({ ...currentAdmin, role: value as "admin" | "superadmin" })}
                  disabled={currentAdmin.role === "superadmin"} // Запрещаем менять роль суперадмина
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="superadmin">Суперадминистратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Статус</Label>
                <Select
                  value={currentAdmin.status}
                  onValueChange={(value) =>
                    setCurrentAdmin({ ...currentAdmin, status: value as "active" | "inactive" })
                  }
                  disabled={currentAdmin.role === "superadmin"} // Запрещаем менять статус суперадмина
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Активен</SelectItem>
                    <SelectItem value="inactive">Неактивен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditAdmin} className="bg-[#7635E9] hover:bg-[#6025c7]">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления администратора */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить администратора</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого администратора? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {currentAdmin && (
            <div className="py-4">
              <p>
                <strong>ФИО:</strong> {currentAdmin.name}
              </p>
              <p>
                <strong>Email:</strong> {currentAdmin.email}
              </p>
              <p>
                <strong>Роль:</strong> {currentAdmin.role === "superadmin" ? "Суперадминистратор" : "Администратор"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
