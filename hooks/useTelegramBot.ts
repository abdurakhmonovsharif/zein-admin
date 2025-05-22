import api from "@/lib/axios"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export interface TelegramBot {
  id: number
  bot_token: string
  admin_chat_id: string
}

// 1. Fetch Telegram Bot (assuming single active config)
const fetchTelegramBot = async (): Promise<TelegramBot> => {
  const res = await api.get("/telegram-settings/active/")
  return res.data
}

// 2. Update Telegram Bot
const updateTelegramBot = async (updatedBot: TelegramBot): Promise<TelegramBot> => {
  const res = await api.put(`/telegram-settings/${updatedBot.id}/`, updatedBot)
  return res.data
}

// 3. Hook
export function useTelegramBot() {
  const queryClient = useQueryClient()

  // GET active Telegram Bot settings
  const {
    data,
    isLoading,
    error,
  } = useQuery<TelegramBot, Error>({
    queryKey: ["telegramBot"],
    queryFn: fetchTelegramBot,
  })

  // PUT update
  const updateMutation = useMutation<TelegramBot, Error, TelegramBot, { previousBot?: TelegramBot }>({
    mutationFn: updateTelegramBot,
    onMutate: async (updatedBot) => {
      await queryClient.cancelQueries({ queryKey: ["telegramBot"] })
      const previousBot = queryClient.getQueryData<TelegramBot>(["telegramBot"])
      queryClient.setQueryData(["telegramBot"], updatedBot)
      return { previousBot }
    },
    onError: (_err, _updatedBot, context) => {
      if (context?.previousBot) {
        queryClient.setQueryData(["telegramBot"], context.previousBot)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["telegramBot"] })
    },
  })

  return {
    data,
    isLoading,
    error,
    updateMutation,
  }
}
