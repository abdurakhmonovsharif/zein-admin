"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "ZEIN EDTECH",
    siteDescription: "Образовательная платформа для изучения различных предметов",
    contactEmail: "info@zein.edu",
    contactPhone: "+7 (495) 123-45-67",
    address: "г. Москва, ул. Ленина, 10",
    hero_banner:"/banner.png"
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "ZEIN EDTECH - Образовательная платформа",
    metaDescription: "Образовательная платформа для изучения различных предметов. Курсы, тесты, задания.",
    keywords: "образование, обучение, курсы, тесты, задания",
    ogImage: "",
  })

  const [accountSettings, setAccountSettings] = useState({
    name: "Администратор",
    email: "admin@zein.edu",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newStudentNotifications: true,
    systemUpdates: true,
    marketingEmails: false,
  })

  const handleSaveGeneralSettings = () => {
    // Здесь будет логика сохранения настроек
    toast({
      title: "Настройки сохранены",
      description: "Общие настройки успешно обновлены",
    })
  }

  const handleSaveSeoSettings = () => {
    // Здесь будет логика сохранения SEO настроек
    toast({
      title: "Настройки сохранены",
      description: "SEO настройки успешно обновлены",
    })
  }

  const handleSaveAccountSettings = () => {
    // Здесь будет логика сохранения настроек аккаунта
    toast({
      title: "Настройки сохранены",
      description: "Настройки аккаунта успешно обновлены",
    })
  }

  const handleSaveNotificationSettings = () => {
    // Здесь будет логика сохранения настроек уведомлений
    toast({
      title: "Настройки сохранены",
      description: "Настройки уведомлений успешно обновлены",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Настройки</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="account">Аккаунт</TabsTrigger>
        </TabsList>
        {/* Общие настройки */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Настройте основную информацию о платформе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Название сайта</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteDescription">Описание сайта</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="siteDescription">Баннер</Label>
                <Input
                  id="siteDescription"
                  type="file"
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Контактный email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPhone">Контактный телефон</Label>
                <Input
                  id="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings} className="bg-[#7635E9] hover:bg-[#6025c7]">
                Сохранить изменения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SEO настройки */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
              <CardDescription>Настройте параметры для поисковой оптимизации</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">Ключевые слова</Label>
                <Input
                  id="keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                  placeholder="Введите ключевые слова через запятую"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={seoSettings.ogImage}
                  onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                  placeholder="URL изображения для социальных сетей"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSeoSettings} className="bg-[#7635E9] hover:bg-[#6025c7]">
                Сохранить изменения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Настройки аккаунта */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Настройки аккаунта</CardTitle>
              <CardDescription>Управляйте своим профилем и настройками безопасности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">ФИО</Label>
                <Input
                  id="name"
                  value={accountSettings.name}
                  onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={accountSettings.currentPassword}
                  onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={accountSettings.newPassword}
                  onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={accountSettings.confirmPassword}
                  onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAccountSettings} className="bg-[#7635E9] hover:bg-[#6025c7]">
                Сохранить изменения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  )
}
