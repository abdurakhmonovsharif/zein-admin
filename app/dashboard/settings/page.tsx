"use client"

import { PasswordResetForm } from "@/components/settings/PasswordResetForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useContact } from "@/hooks/useContact"
import { useSEO } from "@/hooks/useSEO"
import { useTelegramBot } from "@/hooks/useTelegramBot"
import { Upload } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface TelegramBot {
  id?: number;
  bot_token: string;
  admin_chat_id: string
}

interface GeneralSettings {
  contactEmail: string;
  contactPhone: string;
  hero_banner: string | File;
  telegram: string;
  instagram: string;
  previewUrl?: string;
}

export default function SettingsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'general'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const { user, isDevRole, isSuperAdminRole, updateProfile } = useAuth()
  const { data: contactData, isLoading: isContactLoading, updateMutation, createMutation } = useContact()
  const { data: seoData, isLoading: isSeoLoading, updateMutation: updateSeoMutation, createMutation: createSeoMutation } = useSEO()
  const { data, isLoading, updateMutation: updateTelegramMutation } = useTelegramBot()
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    contactEmail: "",
    contactPhone: "",
    hero_banner: "",
    telegram: "",
    instagram: "",
  })

  const [seoSettings, setSeoSettings] = useState({
    id: undefined as number | undefined,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: null as File | string | null,
    previewUrl: undefined as string | undefined,
  })

  const [accountSettings, setAccountSettings] = useState({
    name: user?.full_name || "Загрузка...",
    username: user?.username || "Загрузка...",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newStudentNotifications: true,
    systemUpdates: true,
    marketingEmails: false,
  })

  const [telegramBotSettings, setTelegramBotSettings] = useState<TelegramBot>({ bot_token: "", admin_chat_id: "" })

  const [isUpdating, setIsUpdating] = useState(false)

  console.log('Current user data:', user)

  useEffect(() => {
    console.log('User data updated:', user)
    if (user) {
      setAccountSettings(prev => ({
        ...prev,
        name: user.full_name,
        username: user.username,
      }))
    }
  }, [user])

  useEffect(() => {
    if (data) {
      setTelegramBotSettings({
        id: data.id,
        bot_token: data.bot_token,
        admin_chat_id: data.admin_chat_id
      })
    }
  }, [data])

  useEffect(() => {
    if (contactData) {
      setGeneralSettings({
        contactEmail: contactData.email || "",
        contactPhone: contactData.phone || "",
        hero_banner: contactData.hero_banner || "",
        telegram: contactData.telegram || "",
        instagram: contactData.instagram || "",
      })
    }
  }, [contactData])

  useEffect(() => {
    if (seoData) {
      setSeoSettings({
        id: seoData.id,
        metaTitle: seoData.metaTitle || "",
        metaDescription: seoData.metaDescription || "",
        keywords: seoData.keywords || "",
        ogImage: seoData.ogImage || null,
        previewUrl: seoData.ogImage || undefined,
      })
    }
  }, [seoData])

  useEffect(() => {
    // Update active tab when URL parameter changes
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  const handleSaveGeneralSettings = () => {
    const formData = new FormData();

    // Handle file upload
    if (generalSettings.hero_banner instanceof File) {
      formData.append('hero_banner', generalSettings.hero_banner);
    }

    // Add other fields to formData
    formData.append('email', generalSettings.contactEmail);
    formData.append('phone', generalSettings.contactPhone);
    formData.append('telegram', generalSettings.telegram);
    formData.append('instagram', generalSettings.instagram);

    // Only append id if it exists
    if (contactData && contactData.id) {
      formData.append('id', String(contactData.id));
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }

    toast({
      title: "Настройки сохранены",
      description: "Общие настройки успешно обновлены",
    })
  }

  const handleSaveSeoSettings = () => {
    const formData = new FormData()

    if (seoSettings.ogImage instanceof File) {
      formData.append('ogImage', seoSettings.ogImage)
    }

    formData.append('metaTitle', seoSettings.metaTitle)
    formData.append('metaDescription', seoSettings.metaDescription)
    formData.append('keywords', seoSettings.keywords)

    if (seoSettings.id) {
      formData.append('id', String(seoSettings.id))
      updateSeoMutation.mutate(formData)
    } else {
      createSeoMutation.mutate(formData)
    }

    toast({
      title: "Настройки сохранены",
      description: "SEO настройки успешно обновлены",
    })
  }

  const handleSaveAccountSettings = async () => {
    try {
      setIsUpdating(true)
      await updateProfile({
        full_name: accountSettings.name,
        username: accountSettings.username,
      })
      toast({
        title: "Настройки сохранены",
        description: "Профиль успешно обновлен",
      })
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось обновить профиль",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveNotificationSettings = () => {
    // Здесь будет логика сохранения настроек уведомлений
    toast({
      title: "Настройки сохранены",
      description: "Настройки уведомлений успешно обновлены",
    })
  }

  const handleSaveSettingsTelegramBot = () => {
    if (data) {
      updateTelegramMutation.mutate({
        ...data,
        bot_token: telegramBotSettings.bot_token,
        admin_chat_id: telegramBotSettings.admin_chat_id,
      })
    }
    toast({
      title: "Настройки сохранены",
      description: "Настройки Telegram успешно обновлены",
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setGeneralSettings(prev => ({
          ...prev,
          hero_banner: file,
          previewUrl: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSeoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSeoSettings(prev => ({
          ...prev,
          ogImage: file,
          previewUrl: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Настройки</h1>

      <Tabs value={activeTab} defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Контакты</TabsTrigger>
          <TabsTrigger value="telegram">Телеграм бот</TabsTrigger>
          {/* <TabsTrigger value="seo">SEO</TabsTrigger> */}
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
              <div className="grid grid-cols-2 gap-4">
                {/* Preview Image */}
                <div className="flex items-center justify-center">
                  {(generalSettings.previewUrl || generalSettings.hero_banner) && (
                    <div className="relative w-full aspect-video">
                      <img
                        src={generalSettings.previewUrl || (typeof generalSettings.hero_banner === 'string' ? generalSettings.hero_banner : '')}
                        alt="Banner preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                {/* Upload Section */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="banner-upload">Баннер</Label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#7635E9] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600">Перетащите файл сюда или нажмите для выбора</p>
                    <Input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживаемые форматы: JPG, PNG. Максимальный размер: 5MB
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Контактный email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPhone">Контактный телефон</Label>
                <Input
                  id="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={generalSettings.telegram}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, telegram: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={generalSettings.instagram}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveGeneralSettings}
                className="bg-[#7635E9] hover:bg-[#6025c7]"
                disabled={isContactLoading || updateMutation.isPending || createMutation.isPending}
              >
                {(updateMutation.isPending || createMutation.isPending) ? "Сохранение..." : "Сохранить изменения"}
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
              <div className="grid grid-cols-2 gap-4">
                {/* Preview Image */}
                <div className="flex items-center justify-center">
                  {(seoSettings.previewUrl || seoSettings.ogImage) && (
                    <div className="relative w-full aspect-video">
                      <img
                        src={seoSettings.previewUrl || (typeof seoSettings.ogImage === 'string' ? seoSettings.ogImage : '')}
                        alt="OG Image preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                {/* Upload Section */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="og-image">OG Image</Label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#7635E9] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600 text-center">Перетащите файл сюда или нажмите для выбора</p>
                    <Input
                      id="og-image"
                      type="file"
                      accept="image/*"
                      onChange={handleSeoImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживаемые форматы: JPG, PNG. Максимальный размер: 5MB
                  </p>
                </div>
              </div>
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
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSeoSettings}
                className="bg-[#7635E9] hover:bg-[#6025c7]"
                disabled={isSeoLoading || updateSeoMutation.isPending || createSeoMutation.isPending}
              >
                {(updateSeoMutation.isPending || createSeoMutation.isPending) ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Настройки аккаунта */}
        <TabsContent value="account" className="space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Настройки аккаунта</h3>
              <p className="text-sm text-muted-foreground">
                Управление профилем и настройками безопасности
              </p>
            </div>
            <Separator />
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Информация профиля</CardTitle>
                  <CardDescription>
                    Информация о вашем аккаунте
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ФИО</Label>
                    <Input
                      id="name"
                      value={accountSettings.name}
                      onChange={(e) =>
                        setAccountSettings({ ...accountSettings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      value={accountSettings.username}
                      onChange={(e) =>
                        setAccountSettings({ ...accountSettings, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Роль</Label>
                    <Input
                      id="role"
                      value={user?.role === 'dev' ? 'Разработчик' :
                        user?.role === 'super_admin' ? 'Супер администратор' :
                          'Администратор'}
                      disabled
                      readOnly
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveAccountSettings}
                    className="w-full bg-[#7635E9] hover:bg-[#6025c7]"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </CardFooter>
              </Card>

              <PasswordResetForm />
            </div>
          </div>
        </TabsContent>
        {/* Настройки Телеграмм бот */}
        <TabsContent value="telegram">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Telegram</CardTitle>
              <CardDescription>Введите данные для подключения к Telegram</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="userTelegramId">ID администратора Telegram</Label>
                <Input
                  id="userTelegramId"
                  value={telegramBotSettings?.admin_chat_id}
                  onChange={(e) =>
                    setTelegramBotSettings({ ...telegramBotSettings, admin_chat_id: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="botToken">Токен бота</Label>
                <Input
                  id="botToken"
                  value={telegramBotSettings.bot_token}
                  onChange={(e) =>
                    setTelegramBotSettings({ ...telegramBotSettings, bot_token: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettingsTelegramBot}
                className="bg-[#7635E9] hover:bg-[#6025c7]"
              >
                Сохранить Telegram
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
