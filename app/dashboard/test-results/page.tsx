"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface TestResult {
  id: number
  userId: string
  questionId: number
  score: number
  totalQuestions: number
  timeTaken: string
  questionData: string
}

// Russian translations
const translations = {
  table: {
    title: "Результаты тестов",
    columns: {
      id: "ID",
      user: "Пользователь",
      questionId: "ID вопроса",
      score: "Оценка",
      totalQuestions: "Всего вопросов",
      time: "Время",
      action: "Действие"
    },
    dialog: {
      title: "Детали вопроса",
      questionId: "ID вопроса",
      questionData: "Данные вопроса",
      viewQuestion: "Просмотреть вопрос"
    }
  }
};

const TestResults = () => {
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null)
  const [testData, setTestData] = useState<TestResult[]>([
    {
      id: 1,
      userId: "user123",
      questionId: 101,
      score: 85,
      totalQuestions: 20,
      timeTaken: "35:45",
      questionData: "Sample question data for test 1..."
    },
    {
      id: 2,
      userId: "user456",
      questionId: 102,
      score: 92,
      totalQuestions: 20,
      timeTaken: "42:15",
      questionData: "Sample question data for test 2..."
    }
  ])

  const selectedTest = testData.find(test => test.id === selectedTestId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{translations.table.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.table.columns.id}</TableHead>
                  <TableHead>{translations.table.columns.user}</TableHead>
                  <TableHead>{translations.table.columns.questionId}</TableHead>
                  <TableHead>{translations.table.columns.score}</TableHead>
                  <TableHead>{translations.table.columns.totalQuestions}</TableHead>
                  <TableHead>{translations.table.columns.time}</TableHead>
                  <TableHead>{translations.table.columns.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testData.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.id}</TableCell>
                    <TableCell>{test.userId}</TableCell>
                    <TableCell>{test.questionId}</TableCell>
                    <TableCell>{`${test.score}%`}</TableCell>
                    <TableCell>{test.totalQuestions}</TableCell>
                    <TableCell>{test.timeTaken}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            {translations.table.dialog.viewQuestion}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{translations.table.dialog.title}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{translations.table.dialog.questionId}</span>
                              <span className="text-sm">{test.questionId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{translations.table.dialog.questionData}</span>
                              <span className="text-sm">{test.questionData}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


    </div>
  )
};

export default TestResults;