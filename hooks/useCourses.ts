import api from "@/lib/axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

// Define the Course and CourseLevel types
export interface Course {
  id: number
  name_uz: string
  name_ru: string
  levels: CourseLevel[]
}

export interface CourseLevel {
  id: number
  course: number
  title_uz: string
  title_ru: string
  level: string
  duration_months: string
  price: number
  features_uz: string[]
  features_ru: string[]
}

// 1. Fetch Courses
const fetchCourses = async (): Promise<Course[]> => {
  const res = await api.get("/courses/")
  return res.data
}

// 2. Add Course
const addCourse = async (newCourse: Omit<Course, "id" | "levels">): Promise<Course> => {
  const res = await api.post("/courses/", newCourse)
  return res.data
}

// 3. Update Course
const updateCourse = async (updatedCourse: Omit<Course, "levels">): Promise<Course> => {
  const res = await api.put(`/courses/${updatedCourse.id}/`, updatedCourse)
  return res.data
}

// 4. Delete Course
const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/${id}/`)
}

// 5. useCourses hook
export function useCourses() {
  const queryClient = useQueryClient()

  // Fetching
  const {
    data,
    isLoading,
    error,
  } = useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  })

  // Add Course
  const addCourseMutation = useMutation<Course, Error, Omit<Course, "id" | "levels">, { previousCourses?: Course[] }>({
    mutationFn: addCourse,
    onMutate: async (newCourse) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] })
      const previousCourses = queryClient.getQueryData<Course[]>(["courses"])

      queryClient.setQueryData<Course[]>(["courses"], (oldCourses = []) => [
        ...oldCourses,
        { ...newCourse, id: Math.random(), levels: [] },
      ])

      return { previousCourses }
    },
    onError: (_err, _newCourse, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  // Update Course
  const updateCourseMutation = useMutation<Course, Error, Omit<Course, "levels">, { previousCourses?: Course[] }>({
    mutationFn: updateCourse,
    onMutate: async (updatedCourse) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] })
      const previousCourses = queryClient.getQueryData<Course[]>(["courses"])

      queryClient.setQueryData<Course[]>(["courses"], (oldCourses = []) =>
        oldCourses.map((course) =>
          course.id === updatedCourse.id
            ? { ...course, ...updatedCourse }
            : course
        )
      )

      return { previousCourses }
    },
    onError: (_err, _updatedCourse, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  // Delete Course
  const deleteCourseMutation = useMutation<void, Error, number, { previousCourses?: Course[] }>({
    mutationFn: deleteCourse,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] })
      const previousCourses = queryClient.getQueryData<Course[]>(["courses"])

      queryClient.setQueryData<Course[]>(["courses"], (oldCourses = []) =>
        oldCourses.filter((course) => course.id !== id)
      )

      return { previousCourses }
    },
    onError: (_err, _id, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addCourseMutation,
    updateCourseMutation,
    deleteCourseMutation,
  }
}
