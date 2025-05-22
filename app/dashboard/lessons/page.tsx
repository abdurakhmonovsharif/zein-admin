"use client";

import {
  Button,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Subject, useSubjects } from "@/hooks/useSubject";
import { useTopics } from "@/hooks/useTopics";
import { formatDate } from "@/lib/formatDate";
import { useState } from "react";

export default function TopicsTable() {
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const {
    data: topics,
    addTopicMutation,
    updateTopicMutation,
    deleteTopicMutation,
    isLoading,
  } = useTopics(subjectFilter, sortOrder);

  const { data: subjects } = useSubjects();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    subjectId: "",
    subject: ""
  });

  const resetForm = () => {
    setForm({ name: "", description: "", subjectId: "", subject: "" });
    setEditId(null);
  };

  const handleCreateOrUpdate = () => {
    if (!form.name || !form.subjectId) return;

    if (editId) {
      const originalTopic = topics?.find(t => t.id === editId);

      if (originalTopic) {
        updateTopicMutation.mutate(
          {
            ...originalTopic,
            name: form.name,
            description: form.description,
            subject: {
              ...originalTopic.subject,
              id: parseInt(form.subjectId)
            }
          },
          {
            onSuccess: () => {
              resetForm();
              setOpen(false);
            },
          }
        );
      }
    } else {
      addTopicMutation.mutate({
        name: form.name,
        description: form.description,
        subject: subjects?.find(s => s.id === parseInt(form.subjectId)) as Subject,
        image: null,
        created_at: new Date().toISOString()
      }, {
        onSuccess: () => {
          resetForm();
          setOpen(false);
        },
      });
    }
  };

  const handleEdit = (topic: any) => {
    setEditId(topic.id);
    setForm({
      name: topic.name,
      description: topic.description || "",
      subjectId: topic.subject?.id?.toString() || "",
      subject: topic.subject.id
    });
    setOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Темы</h2>
        <div className="flex items-center gap-x-3">
          <Select
            value={subjectFilter}
            onValueChange={(value) => setSubjectFilter(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Фильтр по предмету" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все предметы</SelectItem>
              {subjects?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>{editId ? "Редактировать тему" : "Создать тему"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "Редактировать тему" : "Создание новой темы"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Предмет</Label>
                  <Select
                    value={form.subjectId}
                    onValueChange={(val) => setForm({ ...form, subjectId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateOrUpdate}>
                  {editId ? "Обновить" : "Создать"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Вопросов</TableHead>
            <TableHead>Предмет</TableHead>
            <TableHead
              className="hidden md:table-cell cursor-pointer select-none"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              Дата создания {sortOrder === "asc" ? "↑" : "↓"}
            </TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7}>Загрузка...</TableCell>
            </TableRow>
          ) : (
            topics?.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.id}</TableCell>
                <TableCell>{topic.name}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>{topic.question_count}</TableCell>
                <TableCell>{topic?.subject?.name}</TableCell>
                <TableCell>{formatDate(topic.created_at)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(topic)}>
                    Редактировать
                  </Button>
                  <Button variant="destructive" onClick={() => deleteTopicMutation.mutate(topic.id)}>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
