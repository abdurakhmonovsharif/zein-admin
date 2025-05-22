import { useClientRequests } from "@/hooks/useClientRequest"
import { formatDate } from "@/lib/formatDate"
import { Badge } from "../ui/badge"

const RecentClients = () => {
  const { data: recentClientRequests } = useClientRequests()
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }
  return (
    <div>
      {recentClientRequests?.map((client, index) => (
        <div key={index + "row" + client?.id} className="flex items-center justify-between">
          <div className="flex items-center w-full  gap-3">
            <div className="flex-1 space-y-1 ">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{client.name}</p>
                <Badge variant="outline" className="text-xs font-normal">
                  Клиент #{client.id}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{client.phone_number}</span>
                <time dateTime={client.created_at} className="text-xs">
                  {formatDate(client.created_at)}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default RecentClients

