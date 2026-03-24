import { OnlineUser } from "@/hooks/useSocket";
import { Circle } from "lucide-react";

interface UsersListProps {
  users: OnlineUser[];
  currentUser: string | null;
}

const UsersList = ({ users, currentUser }: UsersListProps) => (
  <div className="flex flex-col gap-1 p-3">
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Online — {users.length}
    </h3>
    {users.map((u) => (
      <div key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm">
        <Circle className="h-2 w-2 fill-accent text-accent" />
        <span className={u.username === currentUser ? "font-semibold" : ""}>
          {u.username}
          {u.username === currentUser && (
            <span className="ml-1 text-xs text-muted-foreground">(você)</span>
          )}
        </span>
      </div>
    ))}
  </div>
);

export default UsersList;
