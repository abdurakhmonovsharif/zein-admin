"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCourseLevels } from "@/hooks/useCourseLevels"
import { useCourses, type Course, type CourseLevel } from "@/hooks/useCourses"
import { Eye, Pencil, Plus, Trash, X } from "lucide-react"
import { useState } from "react"

// Add new interface for feature pairs
interface FeaturePair {
  uz: string;
  ru: string;
}

export default function CoursesPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("courses")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false)
  const [isEditLevelOpen, setIsEditLevelOpen] = useState(false)
  const [isViewFeaturesOpen, setIsViewFeaturesOpen] = useState(false)
  const [viewingLevel, setViewingLevel] = useState<CourseLevel | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingLevel, setEditingLevel] = useState<CourseLevel | null>(null)
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all")
  // Add states for features
  const [newFeatures, setNewFeatures] = useState<FeaturePair[]>([{ uz: "", ru: "" }])
  const [editFeatures, setEditFeatures] = useState<FeaturePair[]>([])

  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
    deleteCourseMutation,
    addCourseMutation,
    updateCourseMutation,
  } = useCourses()

  const {
    data: levels,
    isLoading: levelsLoading,
    error: levelsError,
    deleteCourseLevelMutation,
    addCourseLevelMutation,
    updateCourseLevelMutation,
  } = useCourseLevels()

  // Add filtered levels computation
  const filteredLevels = levels?.filter(level =>
    selectedCourseFilter === "all" || level.course.toString() === selectedCourseFilter
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatInputPrice = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '')
    // Format with thousand separators
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputPrice(e.target.value)
    e.target.value = formatted
  }

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCourse = {
      name_uz: formData.get("name_uz") as string,
      name_ru: formData.get("name_ru") as string,
      language: formData.get("language") as string,
    }

    try {
      await addCourseMutation.mutateAsync(newCourse)
      setIsAddCourseOpen(false)
      toast({
        title: "Успех",
        description: "Курс успешно создан",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать курс",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingCourse) return

    const formData = new FormData(e.currentTarget)
    const updatedCourse = {
      id: editingCourse.id,
      name_uz: formData.get("name_uz") as string,
      name_ru: formData.get("name_ru") as string,
    }

    try {
      await updateCourseMutation.mutateAsync(updatedCourse)
      setIsEditCourseOpen(false)
      setEditingCourse(null)
      toast({
        title: "Успех",
        description: "Курс успешно обновлен",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить курс",
        variant: "destructive",
      })
    }
  }

  // Add function to handle adding new feature inputs
  const addNewFeature = (isEdit: boolean) => {
    if (isEdit) {
      setEditFeatures([...editFeatures, { uz: "", ru: "" }])
    } else {
      setNewFeatures([...newFeatures, { uz: "", ru: "" }])
    }
  }

  // Add function to handle removing feature inputs
  const removeFeature = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditFeatures(editFeatures.filter((_, i) => i !== index))
    } else {
      setNewFeatures(newFeatures.filter((_, i) => i !== index))
    }
  }

  // Add function to handle feature input changes
  const handleFeatureChange = (index: number, field: 'uz' | 'ru', value: string, isEdit: boolean) => {
    if (isEdit) {
      const updatedFeatures = [...editFeatures]
      updatedFeatures[index][field] = value
      setEditFeatures(updatedFeatures)
    } else {
      const updatedFeatures = [...newFeatures]
      updatedFeatures[index][field] = value
      setNewFeatures(updatedFeatures)
    }
  }

  const handleAddLevel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newLevel = {
      course: Number(formData.get("course")),
      title_uz: formData.get("title_uz") as string,
      title_ru: formData.get("title_ru") as string,
      level: formData.get("level") as string,
      duration_months: formData.get("duration_months") as string,
      price: Number(formData.get("raw_price")),
      features_uz: newFeatures.map(f => f.uz).filter(Boolean),
      features_ru: newFeatures.map(f => f.ru).filter(Boolean),
    }

    try {
      await addCourseLevelMutation.mutateAsync(newLevel)
      setIsAddLevelOpen(false)
      setNewFeatures([{ uz: "", ru: "" }]) // Reset features
      toast({
        title: "Успех",
        description: "Уровень курса успешно создан",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать уровень курса",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLevel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingLevel) return

    const formData = new FormData(e.currentTarget)
    const updatedLevel = {
      id: editingLevel.id,
      course: Number(formData.get("course")),
      title_uz: formData.get("title_uz") as string,
      title_ru: formData.get("title_ru") as string,
      level: formData.get("level") as string,
      duration_months: formData.get("duration_months") as string,
      price: Number(formData.get("raw_price")),
      features_uz: editFeatures.map(f => f.uz).filter(Boolean),
      features_ru: editFeatures.map(f => f.ru).filter(Boolean),
    }

    try {
      await updateCourseLevelMutation.mutateAsync(updatedLevel)
      setIsEditLevelOpen(false)
      setEditingLevel(null)
      setEditFeatures([]) // Reset edit features
      toast({
        title: "Успех",
        description: "Уровень курса успешно обновлен",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить уровень курса",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCourse = async (id: number) => {
    try {
      await deleteCourseMutation.mutateAsync(id)
      toast({
        title: "Успех",
        description: "Курс успешно удален",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить курс",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLevel = async (id: number) => {
    try {
      await deleteCourseLevelMutation.mutateAsync(id)
      toast({
        title: "Успех",
        description: "Уровень курса успешно удален",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить уровень курса",
        variant: "destructive",
      })
    }
  }

  if (coursesError || levelsError) {
    return <div>Ошибка загрузки данных</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
            <TabsTrigger value="levels">Уровни курсов</TabsTrigger>
          </TabsList>
          <Dialog open={activeTab === "courses" ? isAddCourseOpen : isAddLevelOpen}
            onOpenChange={activeTab === "courses" ? setIsAddCourseOpen : setIsAddLevelOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {activeTab === "courses" ? "Добавить курс" : "Добавить уровень"}
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {activeTab === "courses" ? "Добавить новый курс" : "Добавить новый уровень"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={activeTab === "courses" ? handleAddCourse : handleAddLevel} className="space-y-4">
                {activeTab === "courses" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name_uz">Название (UZ)</Label>
                      <Input id="name_uz" name="name_uz" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_ru">Название (RU)</Label>
                      <Input id="name_ru" name="name_ru" required />
                    </div>

                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="course">Курс</Label>
                      <Select name="course" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите курс" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses?.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name_ru}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_uz">Название (UZ)</Label>
                      <Input id="title_uz" name="title_uz" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_ru">Название (RU)</Label>
                      <Input id="title_ru" name="title_ru" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Уровень</Label>
                      <Input id="level" name="level" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_months">Длительность (месяцев)</Label>
                      <Input id="duration_months" name="duration_months" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Цена (сум)</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          name="price"
                          type="text"
                          required
                          placeholder="1 000 000"
                          onChange={handlePriceInput}
                          onBlur={(e) => {
                            // Store the raw number value in a hidden input
                            const rawValue = e.target.value.replace(/\D/g, '')
                            const hiddenInput = document.getElementById('raw_price') as HTMLInputElement
                            if (hiddenInput) hiddenInput.value = rawValue
                          }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          сум
                        </span>
                        <input type="hidden" id="raw_price" name="raw_price" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Особенности курса</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addNewFeature(false)}
                        >
                          <Plus className="h-4 w-4" /> Добавить особенность
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {newFeatures.map((feature, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder="Особенность на узбекском"
                                value={feature.uz}
                                onChange={(e) => handleFeatureChange(index, 'uz', e.target.value, false)}
                              />
                              <Input
                                placeholder="Особенность на русском"
                                value={feature.ru}
                                onChange={(e) => handleFeatureChange(index, 'ru', e.target.value, false)}
                              />
                            </div>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index, false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <Button type="submit" className="w-full">
                  {activeTab === "courses" ? "Создать курс" : "Создать уровень"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Курсы</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название (UZ)</TableHead>
                    <TableHead>Название (RU)</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Загрузка...
                      </TableCell>
                    </TableRow>
                  ) : courses?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Курсы не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses?.map((course: Course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.id}</TableCell>
                        <TableCell>{course.name_uz}</TableCell>
                        <TableCell>{course.name_ru}</TableCell>
                        <TableCell className="flex gap-2">
                          <Dialog open={isEditCourseOpen && editingCourse?.id === course.id}
                            onOpenChange={(open) => {
                              setIsEditCourseOpen(open)
                              if (!open) setEditingCourse(null)
                            }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingCourse(course)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent >
                              <DialogHeader>
                                <DialogTitle>Редактировать курс</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateCourse} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name_uz">Название (UZ)</Label>
                                  <Input id="name_uz" name="name_uz" defaultValue={course.name_uz} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="name_ru">Название (RU)</Label>
                                  <Input id="name_ru" name="name_ru" defaultValue={course.name_ru} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="language">Язык</Label>
                                </div>
                                <Button type="submit" className="w-full">
                                  Обновить курс
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Уровни курсов</CardTitle>
                <div className="w-[200px]">
                  <Select
                    value={selectedCourseFilter}
                    onValueChange={setSelectedCourseFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Фильтр по курсу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все курсы</SelectItem>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name_ru}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Курс</TableHead>
                    <TableHead>Название (UZ)</TableHead>
                    <TableHead>Название (RU)</TableHead>
                    <TableHead>Уровень</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levelsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Загрузка...
                      </TableCell>
                    </TableRow>
                  ) : filteredLevels?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Уровни курсов не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLevels?.map((level: CourseLevel) => (
                      <TableRow key={level.id}>
                        <TableCell>{level.id}</TableCell>
                        <TableCell>
                          {courses?.find(c => c.id === level.course)?.name_ru}
                        </TableCell>
                        <TableCell>{level.title_uz}</TableCell>
                        <TableCell>{level.title_ru}</TableCell>
                        <TableCell>{level.level}</TableCell>
                        <TableCell>{level.duration_months} мес.</TableCell>
                        <TableCell>{formatPrice(level.price)}</TableCell>
                        <TableCell className="flex gap-2">
                          <Dialog
                            open={isViewFeaturesOpen && viewingLevel?.id === level.id}
                            onOpenChange={(open) => {
                              setIsViewFeaturesOpen(open)
                              if (!open) setViewingLevel(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingLevel(level)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Особенности курса</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-sm font-medium mb-3">На узбекском:</h4>
                                  <ul className="list-disc pl-6 space-y-2">
                                    {level.features_uz.map((feature, index) => (
                                      <li key={index} className="text-sm">{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-3">На русском:</h4>
                                  <ul className="list-disc pl-6 space-y-2">
                                    {level.features_ru.map((feature, index) => (
                                      <li key={index} className="text-sm">{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={isEditLevelOpen && editingLevel?.id === level.id}
                            onOpenChange={(open) => {
                              setIsEditLevelOpen(open)
                              if (!open) setEditingLevel(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingLevel(level)
                                  // Initialize edit features from existing level features
                                  setEditFeatures(
                                    level.features_uz.map((uz, index) => ({
                                      uz,
                                      ru: level.features_ru[index] || ""
                                    }))
                                  )
                                  if (level.features_uz.length === 0) {
                                    setEditFeatures([{ uz: "", ru: "" }])
                                  }
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Редактировать уровень курса</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateLevel} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="course">Курс</Label>
                                  <Input id="course" name="course" defaultValue={level.course.toString()} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="title_uz">Название (UZ)</Label>
                                  <Input id="title_uz" name="title_uz" defaultValue={level.title_uz} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="title_ru">Название (RU)</Label>
                                  <Input id="title_ru" name="title_ru" defaultValue={level.title_ru} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="level">Уровень</Label>
                                  <Input id="level" name="level" defaultValue={level.level} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="duration_months">Длительность (месяцев)</Label>
                                  <Input
                                    id="duration_months"
                                    name="duration_months"
                                    defaultValue={level.duration_months}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit_price">Цена (сум)</Label>
                                  <div className="relative">
                                    <Input
                                      id="edit_price"
                                      name="price"
                                      type="text"
                                      required
                                      defaultValue={formatInputPrice(level.price.toString())}
                                      onChange={handlePriceInput}
                                      onBlur={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '')
                                        const hiddenInput = document.getElementById('edit_raw_price') as HTMLInputElement
                                        if (hiddenInput) hiddenInput.value = rawValue
                                      }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                      сум
                                    </span>
                                    <input
                                      type="hidden"
                                      id="edit_raw_price"
                                      name="raw_price"
                                      defaultValue={level.price.toString()}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label>Особенности курса</Label>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => addNewFeature(true)}
                                    >
                                      <Plus className="h-4 w-4" /> Добавить особенность
                                    </Button>
                                  </div>
                                  <div className="space-y-4">
                                    {editFeatures.map((feature, index) => (
                                      <div key={index} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-2">
                                          <Input
                                            placeholder="Особенность на узбекском"
                                            value={feature.uz}
                                            onChange={(e) => handleFeatureChange(index, 'uz', e.target.value, true)}
                                          />
                                          <Input
                                            placeholder="Особенность на русском"
                                            value={feature.ru}
                                            onChange={(e) => handleFeatureChange(index, 'ru', e.target.value, true)}
                                          />
                                        </div>
                                        {index > 0 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFeature(index, true)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Button type="submit" className="w-full">
                                  Обновить уровень
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLevel(level.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
