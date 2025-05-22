"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { ExamResult, useExamResults } from "@/hooks/useResults"
import { formatDate } from "@/lib/formatDate"
import { Pencil, Plus, Trash2, Upload } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"

interface ExtendedExamResult extends Omit<ExamResult, 'image'> {
  image: string | File | null | undefined;
  imageURL?: string;
}

interface NewExam {
  user: string;
  language: string;
  proficiency_level: string;
  exam_score: string;
  exam_type: string;
  image: File | string | undefined;
  imageURL?: string;
  details: { component: string; score: string; }[];
  created_at: string;
  updated_at: string;
}

export default function ExamResultsPage() {
  const {
    data: examResultsData,
    isLoading,
    error,
    addExamResultMutation,
    updateExamResultMutation,
    deleteExamResultMutation
  } = useExamResults()


  const [examResults, setExamResults] = useState<ExtendedExamResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentExam, setCurrentExam] = useState<ExtendedExamResult | null>(null)
  const [newExam, setNewExam] = useState<NewExam>({
    user: "",
    language: "",
    proficiency_level: "",
    exam_score: "",
    exam_type: "",
    image: undefined,
    details: [{ component: "Reading", score: "" }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  // Update local state when data changes
  useEffect(() => {
    if (examResultsData) {
      setExamResults(examResultsData)
    }
  }, [examResultsData])

  // Filter exam results by search term, language and level
  const filteredExamResults = examResults.filter((exam) => {
    const matchesSearch = exam.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === "all" || exam.language === selectedLanguage
    const matchesLevel = selectedLevel === "all" || exam.proficiency_level === selectedLevel

    return matchesSearch && matchesLanguage && matchesLevel
  })


  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }



  const encodeImageFileAsURL = (element: ChangeEvent<HTMLInputElement>) => {
    if (element.target.files && element.target.files[0]) {
      const file = element.target.files[0];
      if (currentExam) {
        // let a = ({ ...currentExam, image: file })
        // console.log(a);
        setCurrentExam({ ...currentExam, image: file });
      } else {

        setNewExam({ ...newExam, image: file });
      }
      const reader = new FileReader();
      reader.onloadend = function () {
        const result = typeof reader.result === 'string' ? reader.result : null;
        if (result && currentExam) {
          setCurrentExam(prev => ({ ...prev!, imageURL: result }));
        } else if (result) {
          setNewExam(prev => ({ ...prev, imageURL: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  }


  // Handle adding new exam result
  const handleAddExam = async () => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('user', newExam.user);
      formData.append('language', newExam.language);
      formData.append('proficiency_level', newExam.proficiency_level);
      formData.append('exam_score', String(newExam.exam_score));
      formData.append('exam_type', newExam.exam_type);
      formData.append('created_at', new Date().toISOString());
      formData.append('updated_at', new Date().toISOString());
      formData.append('details', JSON.stringify(newExam.details));
      formData.append('image', newExam.image as File);

    
      await addExamResultMutation.mutateAsync(formData);

      // Reset form
      setNewExam({
        user: "",
        language: "",
        proficiency_level: "",
        exam_score: "",
        exam_type: "",
        image: undefined,
        details: [{ component: "Reading", score: "" }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  }

  // Handle editing exam result
  const handleEditExam = async () => {
    if (!currentExam) return;

    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('user', currentExam.user);
      formData.append('language', currentExam.language);
      formData.append('proficiency_level', currentExam.proficiency_level);
      formData.append('exam_score', currentExam.exam_score || '0.0');
      formData.append('exam_type', currentExam.exam_type);
      formData.append('created_at', currentExam.created_at);
      formData.append('updated_at', new Date().toISOString());
      formData.append('details', JSON.stringify(currentExam.details));

      // Handle image
      if (currentExam.image instanceof File) {
        formData.append('image', currentExam.image);
      }

      // Debug log
      console.log('Updating exam with image:', currentExam.image);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? 'File object' : value);
      }

      await updateExamResultMutation.mutateAsync({
        formData,
        id: String(currentExam.id)
      });

      setIsEditDialogOpen(false);
      setCurrentExam(null);
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  }

  // Handle deleting exam result
  const handleDeleteExam = () => {
    if (currentExam) {
      // Use mutation to delete exam result
      deleteExamResultMutation.mutate(currentExam.id)
      setIsDeleteDialogOpen(false)
    }
  }

  // Handle adding a component to details
  const handleAddComponent = () => {
    if (currentExam) {
      setCurrentExam({
        ...currentExam,
        details: [...currentExam?.details, { component: "", score: "" }]
      })
    } else {
      setNewExam({
        ...newExam,
        details: [...newExam?.details, { component: "", score: "" }]
      })
    }
  }
  const deleteRowComponent = (index: number) => {
    if (currentExam) {
      const newDetails = [...currentExam?.details];
      newDetails.splice(index, 1);
      setCurrentExam({
        ...currentExam,
        details: newDetails
      });
    } else {
      const newDetails = [...newExam?.details];
      newDetails.splice(index, 1);
      setNewExam({
        ...newExam,
        details: newDetails
      });
    }
  }

  // Handle changing a component in details
  const handleChangeComponent = (index: number, field: string, value: string, isEditing = false) => {
    if (isEditing && currentExam) {
      const updatedDetails = [...currentExam?.details]
      if (field === "component") {
        updatedDetails[index] = { ...updatedDetails[index], component: value }
      } else {
        updatedDetails[index] = { ...updatedDetails[index], score: value }
      }
      setCurrentExam({ ...currentExam, details: updatedDetails })
    } else {
      const updatedDetails = [...newExam?.details]
      if (field === "component") {
        updatedDetails[index] = { ...updatedDetails[index], component: value }
      } else {
        updatedDetails[index] = { ...updatedDetails[index], score: value }
      }
      setNewExam({ ...newExam, details: updatedDetails })
    }
  }

  // Display loading or error states
  if (isLoading) return <div className="p-8 text-center">Загрузка результатов экзаменов...</div>
  if (error) return <div className="p-8 text-center text-red-500">Ошибка: {error.message}</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Экзаменационные результаты</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#7635E9] hover:bg-[#6025c7]">
          <Plus className="mr-2 h-4 w-4" /> Добавить результат
        </Button>
      </div>

      {/* Search and filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Поиск по имени студента..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full h-10 px-3 rounded-md border border-input"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">Все языки</option>
            {[...new Set(examResults.map((exam) => exam.language))].map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="w-full h-10 px-3 rounded-md border border-input"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Все уровни</option>
            {[...new Set(examResults.map((exam) => exam.proficiency_level))].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Изображение</TableHead>
              <TableHead>Язык</TableHead>
              <TableHead>Уровень</TableHead>
              <TableHead>Результат</TableHead>
              <TableHead className="hidden md:table-cell">Тип экзамена</TableHead>
              <TableHead className="hidden md:table-cell">Дата создания</TableHead>
              <TableHead className="hidden md:table-cell">Дата изменения</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExamResults.length > 0 ? (
              filteredExamResults.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={exam.image || undefined} alt={exam.user} />
                        <AvatarFallback>{getInitials(exam.user)}</AvatarFallback>
                      </Avatar>
                      <span>{exam.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>{exam.language}</TableCell>
                  <TableCell>{exam.proficiency_level}</TableCell>
                  <TableCell className="hidden md:table-cell">{exam.exam_score}</TableCell>
                  <TableCell className="hidden md:table-cell">{exam.exam_type}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(exam.created_at)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(exam.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const examWithImage = {
                            ...exam,
                            imageURL: typeof exam.image === 'string' ? exam.image : undefined
                          } as ExtendedExamResult;
                          setCurrentExam(examWithImage);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const examWithImage = {
                            ...exam,
                            imageURL: typeof exam.image === 'string' ? exam.image : undefined
                          } as ExtendedExamResult;
                          setCurrentExam(examWithImage);
                          setIsDeleteDialogOpen(true);
                        }}
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Результаты экзаменов не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for adding exam result */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить результат экзамена</DialogTitle>
            <DialogDescription>Заполните информацию о результате экзамена</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Preview Image */}
              <div className="flex items-center justify-center">
                {((isEditDialogOpen ? currentExam?.imageURL : newExam.imageURL) ||
                  (isEditDialogOpen ? currentExam?.image : newExam.image)) && (
                    <div className="relative w-full aspect-square">
                      <img
                        src={isEditDialogOpen ?
                          (currentExam?.imageURL || (typeof currentExam?.image === 'string' ? currentExam.image : undefined)) :
                          (newExam.imageURL || undefined)}
                        alt="Exam result preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
              </div>
              {/* Upload Section */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="exam-image">Изображение результата</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#7635E9] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600 text-center">Перетащите файл сюда или нажмите для выбора</p>
                  <Input
                    id="exam-image"
                    type="file"
                    accept="image/*"
                    onChange={encodeImageFileAsURL}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Поддерживаемые форматы: JPG, PNG. Максимальный размер: 5MB
                </p>
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="user">Студент</Label>
                  <Input
                    id="user"
                    value={isEditDialogOpen ? currentExam?.user : newExam.user}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, user: e.target.value }))
                        : setNewExam({ ...newExam, user: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Язык</Label>
                  <Input
                    id="language"
                    value={isEditDialogOpen ? currentExam?.language : newExam.language}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, language: e.target.value }))
                        : setNewExam({ ...newExam, language: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proficiency_level">Уровень владения</Label>
                  <Input
                    id="proficiency_level"
                    value={isEditDialogOpen ? currentExam?.proficiency_level : newExam.proficiency_level}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, proficiency_level: e.target.value }))
                        : setNewExam({ ...newExam, proficiency_level: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam_type">Тип экзамена</Label>
                  <Input
                    id="exam_type"
                    value={isEditDialogOpen ? currentExam?.exam_type : newExam.exam_type}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, exam_type: e.target.value }))
                        : setNewExam({ ...newExam, exam_type: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exam_score">Общий балл</Label>
                <Input
                  id="exam_score"
                  type="text"
                  value={isEditDialogOpen ? currentExam?.exam_score : newExam.exam_score}
                  onChange={(e) => {
                    const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                    if (e.target.value === "" || regex.test(e.target.value)) {
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, exam_score: e.target.value }))
                        : setNewExam({ ...newExam, exam_score: e.target.value })
                    }
                  }}
                  placeholder="Введите общий балл ( 5.5, 6.5, 7.0, 9.0 )"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Компоненты экзамена</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddComponent}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Добавить компонент
                  </Button>
                </div>
                {isEditDialogOpen ? currentExam?.details.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={detail.component}
                      onChange={(e) => handleChangeComponent(index, "component", e.target.value, true)}
                      placeholder="Название компонента"
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      value={detail.score}
                      onChange={(e) => {
                        const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                        if (e.target.value === "" || regex.test(e.target.value)) {
                          handleChangeComponent(index, "score", e.target.value, true)
                        }
                      }}
                      placeholder="Балл"
                      className="w-24"
                    />
                    <Button onClick={() => deleteRowComponent(index)} variant={"outline"}><Trash2 className="text-red-500" /></Button>
                  </div>
                )) : newExam?.details?.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={detail.component}
                      onChange={(e) => handleChangeComponent(index, "component", e.target.value)}
                      placeholder="Название компонента"
                      className="flex-1"
                      type="text"
                    />
                    <Input
                      type="text"
                      value={detail.score}
                      onChange={(e) => {
                        const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                        if (e.target.value === "" || regex.test(e.target.value)) {
                          handleChangeComponent(index, "score", e.target.value)
                        }
                      }}
                      placeholder="Балл"
                      className="w-24"
                    />
                    <Button onClick={() => deleteRowComponent(index)} variant={"outline"}><Trash2 className="text-red-500" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleEditExam : handleAddExam}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={isEditDialogOpen ? updateExamResultMutation.isPending : addExamResultMutation.isPending}
            >
              {isEditDialogOpen ? "Сохранение..." : (isAddDialogOpen ? "Добавление..." : "Добавить")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing exam result */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Редактировать результат" : "Добавить новый результат"}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? "Измените информацию о результате экзамена ниже."
                : "Заполните информацию о новом результате экзамена."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Preview Image */}
              <div className="flex items-center justify-center">
                {((isEditDialogOpen ? currentExam?.imageURL : newExam.imageURL) ||
                  (isEditDialogOpen ? currentExam?.image : newExam.image)) && (
                    <div className="relative w-full aspect-square">
                      <img
                        src={isEditDialogOpen ?
                          (currentExam?.imageURL || (typeof currentExam?.image === 'string' ? currentExam.image : undefined)) :
                          (newExam.imageURL || undefined)}
                        alt="Exam result preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
              </div>
              {/* Upload Section */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="exam-image">Изображение результата</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#7635E9] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600 text-center">Перетащите файл сюда или нажмите для выбора</p>
                  <Input
                    id="exam-image"
                    type="file"
                    accept="image/*"
                    onChange={encodeImageFileAsURL}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Поддерживаемые форматы: JPG, PNG. Максимальный размер: 5MB
                </p>
              </div>
            </div>

            {/* Rest of the form fields */}
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="user">Студент</Label>
                  <Input
                    id="user"
                    value={isEditDialogOpen ? currentExam?.user : newExam.user}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, user: e.target.value }))
                        : setNewExam({ ...newExam, user: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Язык</Label>
                  <Input
                    id="language"
                    value={isEditDialogOpen ? currentExam?.language : newExam.language}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, language: e.target.value }))
                        : setNewExam({ ...newExam, language: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="proficiency_level">Уровень владения</Label>
                  <Input
                    id="proficiency_level"
                    value={isEditDialogOpen ? currentExam?.proficiency_level : newExam.proficiency_level}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, proficiency_level: e.target.value }))
                        : setNewExam({ ...newExam, proficiency_level: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam_type">Тип экзамена</Label>
                  <Input
                    id="exam_type"
                    value={isEditDialogOpen ? currentExam?.exam_type : newExam.exam_type}
                    onChange={(e) =>
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, exam_type: e.target.value }))
                        : setNewExam({ ...newExam, exam_type: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exam_score">Общий балл</Label>
                <Input
                  id="exam_score"
                  type="text"
                  value={isEditDialogOpen ? currentExam?.exam_score : newExam.exam_score}
                  onChange={(e) => {
                    const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                    if (e.target.value === "" || regex.test(e.target.value)) {
                      isEditDialogOpen
                        ? setCurrentExam(prev => ({ ...prev!, exam_score: e.target.value }))
                        : setNewExam({ ...newExam, exam_score: e.target.value })
                    }
                  }}
                  placeholder="Введите общий балл ( 5.5, 6.5, 7.0, 9.0 )"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Компоненты экзамена</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddComponent}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Добавить компонент
                  </Button>
                </div>
                {isEditDialogOpen ? currentExam?.details.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={detail.component}
                      onChange={(e) => handleChangeComponent(index, "component", e.target.value, true)}
                      placeholder="Название компонента"
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      value={detail.score}
                      onChange={(e) => {
                        const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                        if (e.target.value === "" || regex.test(e.target.value)) {
                          handleChangeComponent(index, "score", e.target.value, true)
                        }
                      }}
                      placeholder="Балл"
                      className="w-24"
                    />
                    <Button onClick={() => deleteRowComponent(index)} variant={"outline"}><Trash2 className="text-red-500" /></Button>
                  </div>
                )) : newExam?.details?.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={detail.component}
                      onChange={(e) => handleChangeComponent(index, "component", e.target.value)}
                      placeholder="Название компонента"
                      className="flex-1"
                      type="text"
                    />
                    <Input
                      type="text"
                      value={detail.score}
                      onChange={(e) => {
                        const regex = /^([0-9]+(\.[0-9]?)?)?$/;
                        if (e.target.value === "" || regex.test(e.target.value)) {
                          handleChangeComponent(index, "score", e.target.value)
                        }
                      }}
                      placeholder="Балл"
                      className="w-24"
                    />
                    <Button onClick={() => deleteRowComponent(index)} variant={"outline"}><Trash2 className="text-red-500" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Информация о создании</Label>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>
                  <p>Создано: {newExam.created_at ? formatDate(newExam.created_at) : '-'}</p>
                </div>
                <div>
                  <p>Обновлено: {newExam.updated_at ? formatDate(newExam.updated_at) : '-'}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleEditExam : handleAddExam}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={isEditDialogOpen ? updateExamResultMutation.isPending : addExamResultMutation.isPending}
            >
              {isEditDialogOpen ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for deleting exam result */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить результат экзамена</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот результат? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {currentExam && (
            <div className="py-4">
              <p>
                <strong>Студент:</strong> {currentExam.user}
              </p>
              <p>
                <strong>Язык:</strong> {currentExam.language}
              </p>
              <p>
                <strong>Тип экзамена:</strong> {currentExam.exam_type}
              </p>
              <p>
                <strong>Результат:</strong> {currentExam.exam_score}
              </p>
              <p>
                <strong>Дата обновления:</strong> {formatDate(currentExam.updated_at)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteExam}
              disabled={deleteExamResultMutation.isPending}
            >
              {deleteExamResultMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
