"use client"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import RecentClients from "@/components/dashboard/recent-clients"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/axios"
import { BookOpen, FileQuestion, GraduationCap, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DashboardStats {
  totalCourses: number;
  totalQuestions: number;
  totalStudents: number;
  totalClients: number;
  monthlyGrowth: {
    courses: number;
    questions: number;
    students: number;
    clients: number;
  };
}

interface LanguageStats {
  name: string;
  students: number;
  avgScore: number;
}

interface ProficiencyStats {
  name: string;
  value: number;
}

interface ExamComponentStats {
  name: string;
  score: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [languageData, setLanguageData] = useState<LanguageStats[]>([]);
  const [proficiencyData, setProficiencyData] = useState<ProficiencyStats[]>([]);
  const [examComponentData, setExamComponentData] = useState<ExamComponentStats[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch general stats
        const statsResponse = await api.get('/dashboard/stats/');
        setStats(statsResponse.data);

        // Fetch language distribution
        const languageResponse = await api.get('/dashboard/language-stats/');
        setLanguageData(languageResponse.data);

        // Fetch proficiency levels
        const proficiencyResponse = await api.get('/dashboard/proficiency-stats/');
        setProficiencyData(proficiencyResponse.data);

        // Fetch exam component scores
        const examResponse = await api.get('/dashboard/exam-stats/');
        setExamComponentData(examResponse.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Панель управления</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Курсы</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth.courses || 0} за последний месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Вопросы</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth.questions || 0} за последний месяц
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Студенты</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth.students || 0}% по сравнению с прошлым месяцем
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth.clients || 0} за последний месяц
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Активность</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ActivityChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Недавние клиенты</CardTitle>
                <CardDescription>Последние 6 добавленных клиентов</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentClients />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Распределение по языкам</CardTitle>
                <CardDescription>Количество студентов по языкам</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#7635E9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Уровни владения языком</CardTitle>
                <CardDescription>Распределение по уровням CEFR</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={proficiencyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#7635E9"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Средние баллы по компонентам</CardTitle>
                <CardDescription>Результаты по различным аспектам экзаменов</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={examComponentData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#7635E9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
