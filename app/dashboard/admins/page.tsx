"use client"

import { getRoleText } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { AdminUserCreate, useAdmins } from "@/hooks/useAdmins"
import { useAuth } from "@/hooks/useAuth"
import { format } from "date-fns"
import { ru } from 'date-fns/locale'
import { Edit, Lock, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminsPage() {
  const { user, isDevRole, isSuperAdminRole } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { admins, isLoading, createMutation, updateMutation, deleteMutation, resetPasswordMutation } = useAdmins()

  const [newAdmin, setNewAdmin] = useState<AdminUserCreate>({
    full_name: "",
    username: "",
    password: ""
  })

  const [editAdmin, setEditAdmin] = useState<{
    id: number,
    full_name: string,
    username: string
  } | null>(null)

  const [resetPassword, setResetPassword] = useState<{
    id: number,
    username: string,
    new_password: string
  } | null>(null)

  const [deleteAdmin, setDeleteAdmin] = useState<{
    id: number,
    full_name: string,
    username: string
  } | null>(null)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState("")

  // Role-based access control
  useEffect(() => {
    if (user && !isDevRole() && !isSuperAdminRole()) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для просмотра этой страницы",
        variant: "destructive"
      })
      router.push("/dashboard")
    }
  }, [user, isDevRole, isSuperAdminRole, router, toast])

  const validatePassword = (password: string) => {
    const hasUpperCase = /[А-ЯA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) return "Пароль должен содержать хотя бы одну заглавную букву"
    if (!hasNumber) return "Пароль должен содержать хотя бы одну цифру"
    if (!hasSymbol) return "Пароль должен содержать хотя бы один специальный символ"
    return ""
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const handleCreateAdmin = async () => {
    const passwordError = validatePassword(newAdmin.password)
    if (passwordError) {
      setNewPasswordError(passwordError)
      return
    }

    try {
      await createMutation.mutateAsync(newAdmin)
      toast({
        title: "Успешно",
        description: "Администратор успешно создан"
      })
      setIsCreateDialogOpen(false)
      setNewAdmin({
        full_name: "",
        username: "",
        password: ""
      })
      setNewPasswordError("")
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Произошла ошибка при создании администратора",
        variant: "destructive"
      })
    }
  }

  const handleUpdateAdmin = async () => {
    if (!editAdmin) return

    try {
      await updateMutation.mutateAsync({
        id: editAdmin.id,
        data: {
          full_name: editAdmin.full_name,
          username: editAdmin.username
        }
      })
      toast({
        title: "Успешно",
        description: "Данные администратора обновлены"
      })
      setIsEditDialogOpen(false)
      setEditAdmin(null)
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Произошла ошибка при обновлении данных",
        variant: "destructive"
      })
    }
  }

  const handleResetPassword = async () => {
    if (!resetPassword) return

    const passwordError = validatePassword(resetPassword.new_password)
    if (passwordError) {
      setNewPasswordError(passwordError)
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        id: resetPassword.id,
        newPassword: resetPassword.new_password
      })
      toast({
        title: "Успешно",
        description: "Пароль администратора сброшен"
      })
      setIsResetPasswordDialogOpen(false)
      setResetPassword(null)
      setNewPasswordError("")
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Произошла ошибка при сбросе пароля",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteAdmin) return

    try {
      await deleteMutation.mutateAsync(deleteAdmin.id)
      toast({
        title: "Успешно",
        description: "Администратор успешно удален"
      })
      setIsDeleteDialogOpen(false)
      setDeleteAdmin(null)
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Произошла ошибка при удалении администратора",
        variant: "destructive"
      })
    }
  }

  if (!user || (!isDevRole() && !isSuperAdminRole())) {
    return null // Don't render anything if user doesn't have permission
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление администраторами</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7635E9] hover:bg-[#6025c7]">
              <Plus className="mr-2 h-4 w-4" />
              Добавить администратора
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый администратор</DialogTitle>
              <DialogDescription>
                Заполните данные для создания нового администратора
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">ФИО</Label>
                <Input
                  id="full_name"
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  placeholder="Введите ФИО администратора"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  placeholder="Введите имя пользователя"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <PasswordInput
                  id="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Введите пароль"
                  error={newPasswordError}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateAdmin}
                className="bg-[#7635E9] hover:bg-[#6025c7]"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список администраторов</CardTitle>
          <CardDescription>
            Управление учетными записями администраторов системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Загрузка...</div>
          ) : admins && admins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Администратор</TableHead>
                  <TableHead>Имя пользователя</TableHead>
                  <TableHead>Последний вход</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder.avif" alt={admin.full_name} />
                        <AvatarFallback>{getInitials(admin.full_name)}</AvatarFallback>
                      </Avatar>
                      <span>{admin.full_name}</span>
                    </TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>
                      {admin.date_joined
                        ? format(new Date(admin.date_joined), 'dd MMMM yyyy, HH:mm', { locale: ru })
                        : 'Никогда'}
                    </TableCell>
                    <TableCell><Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>{getRoleText(admin.role)}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditAdmin({
                              id: admin.id,
                              full_name: admin.full_name,
                              username: admin.username
                            })
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setResetPassword({
                              id: admin.id,
                              username: admin.username,
                              new_password: ""
                            })
                            setIsResetPasswordDialogOpen(true)
                          }}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setDeleteAdmin({
                              id: admin.id,
                              full_name: admin.full_name,
                              username: admin.username
                            })
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4">Нет данных о администраторах</div>
          )}
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование администратора</DialogTitle>
            <DialogDescription>
              Измените данные администратора
            </DialogDescription>
          </DialogHeader>
          {editAdmin && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_full_name">ФИО</Label>
                <Input
                  id="edit_full_name"
                  value={editAdmin.full_name}
                  onChange={(e) => setEditAdmin({ ...editAdmin, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_username">Имя пользователя</Label>
                <Input
                  id="edit_username"
                  value={editAdmin.username}
                  onChange={(e) => setEditAdmin({ ...editAdmin, username: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleUpdateAdmin}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сброс пароля</DialogTitle>
            <DialogDescription>
              Установите новый пароль для пользователя {resetPassword?.username}
            </DialogDescription>
          </DialogHeader>
          {resetPassword && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new_password">Новый пароль</Label>
                <PasswordInput
                  id="new_password"
                  value={resetPassword.new_password}
                  onChange={(e) => {
                    setResetPassword({ ...resetPassword, new_password: e.target.value })
                    setNewPasswordError("")
                  }}
                  placeholder="Введите новый пароль"
                  error={newPasswordError}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleResetPassword}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? "Сброс..." : "Сбросить пароль"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление администратора</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить администратора {deleteAdmin?.full_name}?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAdmin}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
