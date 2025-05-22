import api from "@/lib/axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { CourseLevel } from "./useCourses"

// 1. Fetch Course Levels
const fetchCourseLevels = async (): Promise<CourseLevel[]> => {
  const res = await api.get("/course-levels/")
  return res.data
}

// 2. Add Course Level
const addCourseLevel = async (newLevel: Omit<CourseLevel, "id">): Promise<CourseLevel> => {
  const res = await api.post("/course-levels/", newLevel)
  return res.data
}

// 3. Update Course Level
const updateCourseLevel = async (updatedLevel: CourseLevel): Promise<CourseLevel> => {
  const res = await api.put(`/course-levels/${updatedLevel.id}/`, updatedLevel)
  return res.data
}

// 4. Delete Course Level
const deleteCourseLevel = async (id: number): Promise<void> => {
  await api.delete(`/course-levels/${id}/`)
}

// 5. useCourseLevels hook
export function useCourseLevels() {
  const queryClient = useQueryClient()

  // Fetching
  const {
    data,
    isLoading,
    error,
  } = useQuery<CourseLevel[], Error>({
    queryKey: ["course-levels"],
    queryFn: fetchCourseLevels,
  })

  // Add Course Level
  const addCourseLevelMutation = useMutation<CourseLevel, Error, Omit<CourseLevel, "id">, { previousLevels?: CourseLevel[] }>({
    mutationFn: addCourseLevel,
    onMutate: async (newLevel) => {
      await queryClient.cancelQueries({ queryKey: ["course-levels"] })
      const previousLevels = queryClient.getQueryData<CourseLevel[]>(["course-levels"])

      queryClient.setQueryData<CourseLevel[]>(["course-levels"], (oldLevels = []) => [
        ...oldLevels,
        { ...newLevel, id: Math.random() },
      ])

      return { previousLevels }
    },
    onError: (_err, _newLevel, context) => {
      if (context?.previousLevels) {
        queryClient.setQueryData(["course-levels"], context.previousLevels)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course-levels"] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  // Update Course Level
  const updateCourseLevelMutation = useMutation<CourseLevel, Error, CourseLevel, { previousLevels?: CourseLevel[] }>({
    mutationFn: updateCourseLevel,
    onMutate: async (updatedLevel) => {
      await queryClient.cancelQueries({ queryKey: ["course-levels"] })
      const previousLevels = queryClient.getQueryData<CourseLevel[]>(["course-levels"])

      queryClient.setQueryData<CourseLevel[]>(["course-levels"], (oldLevels = []) =>
        oldLevels.map((level) =>
          level.id === updatedLevel.id ? updatedLevel : level
        )
      )

      return { previousLevels }
    },
    onError: (_err, _updatedLevel, context) => {
      if (context?.previousLevels) {
        queryClient.setQueryData(["course-levels"], context.previousLevels)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course-levels"] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  // Delete Course Level
  const deleteCourseLevelMutation = useMutation<void, Error, number, { previousLevels?: CourseLevel[] }>({
    mutationFn: deleteCourseLevel,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["course-levels"] })
      const previousLevels = queryClient.getQueryData<CourseLevel[]>(["course-levels"])

      queryClient.setQueryData<CourseLevel[]>(["course-levels"], (oldLevels = []) =>
        oldLevels.filter((level) => level.id !== id)
      )

      return { previousLevels }
    },
    onError: (_err, _id, context) => {
      if (context?.previousLevels) {
        queryClient.setQueryData(["course-levels"], context.previousLevels)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course-levels"] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addCourseLevelMutation,
    updateCourseLevelMutation,
    deleteCourseLevelMutation,
  }
}
