import api from "@/lib/axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

// Type definition
export interface ClientRequest {
  id: number
  name: string
  phone_number: string
  created_at: string // ISO format
}

// 1. Fetch all
const fetchClientRequests = async (): Promise<ClientRequest[]> => {
  const res = await api.get("/requests/")
  return res.data
}
// 1. Fetch all
const fetchRecentClientRequest = async (): Promise<ClientRequest[]> => {
  const res = await api.get("/requests/recent/")
  return res.data
}

// 2. Add
const addClientRequest = async (
  newRequest: Omit<ClientRequest, "id" | "created">
): Promise<ClientRequest> => {
  const res = await api.post("/requests/", newRequest)
  return res.data
}

// 3. Update
const updateClientRequest = async (
  updatedRequest: ClientRequest
): Promise<ClientRequest> => {
  const res = await api.put(`/requests/${updatedRequest.id}/`, updatedRequest)
  return res.data
}

// 4. Delete
const deleteClientRequest = async (id: number): Promise<void> => {
  await api.delete(`/requests/${id}/`)
}

// 5. useClientRequests Hook
export function useClientRequests() {
  const queryClient = useQueryClient()

  // READ
  const {
    data,
    isLoading,
    error,
  } = useQuery<ClientRequest[], Error>({
    queryKey: ["clientRequests"],
    queryFn: fetchClientRequests,
  })
  // READ
  const {
    data:recentClientRequests,
  } = useQuery<ClientRequest[], Error>({
    queryKey: ["recentClientRequests"],
    queryFn: fetchRecentClientRequest,
  })

  // CREATE
  const addRequestMutation = useMutation<
    ClientRequest,
    Error,
    Omit<ClientRequest, "id" | "created">,
    { previousRequests?: ClientRequest[] }
  >({
    mutationFn: addClientRequest,
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: ["clientRequests"] })
      const previousRequests = queryClient.getQueryData<ClientRequest[]>(["clientRequests"])

      queryClient.setQueryData<ClientRequest[]>(["clientRequests"], (old = []) => [
        ...old,
        {
          ...newRequest,
          id: Date.now(), // temporary ID
          created: new Date().toISOString(),
        },
      ])

      return { previousRequests }
    },
    onError: (_err, _newRequest, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["clientRequests"], context.previousRequests)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientRequests"] })
    },
  })

  // UPDATE
  const updateRequestMutation = useMutation<
    ClientRequest,
    Error,
    ClientRequest,
    { previousRequests?: ClientRequest[] }
  >({
    mutationFn: updateClientRequest,
    onMutate: async (updatedRequest) => {
      await queryClient.cancelQueries({ queryKey: ["clientRequests"] })
      const previousRequests = queryClient.getQueryData<ClientRequest[]>(["clientRequests"])

      queryClient.setQueryData<ClientRequest[]>(["clientRequests"], (old = []) =>
        old.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      )

      return { previousRequests }
    },
    onError: (_err, _updated, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["clientRequests"], context.previousRequests)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientRequests"] })
    },
  })

  // DELETE
  const deleteRequestMutation = useMutation<
    void,
    Error,
    number,
    { previousRequests?: ClientRequest[] }
  >({
    mutationFn: deleteClientRequest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["clientRequests"] })
      const previousRequests = queryClient.getQueryData<ClientRequest[]>(["clientRequests"])

      queryClient.setQueryData<ClientRequest[]>(["clientRequests"], (old = []) =>
        old.filter((req) => req.id !== id)
      )

      return { previousRequests }
    },
    onError: (_err, _id, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["clientRequests"], context.previousRequests)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clientRequests"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    addRequestMutation,
    updateRequestMutation,
    deleteRequestMutation,
  }
}
