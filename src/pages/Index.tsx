import { useState } from "react";
import JoinScreen from "@/components/chat/JoinScreen";
import ChatRoom from "@/components/chat/ChatRoom";
import { useTheme } from "@/hooks/useTheme";
import { useSocket } from "@/hooks/useSocket";

const Index = () => {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  useTheme();

  const socketHook = useSocket();

  const handleJoin = async (name: string): Promise<{ error?: string }> => {
    const result = await socketHook.connect(name);
    if (!result?.error) {
      setUsername(name);
      setJoined(true);
    }
    return result;
  };

  if (!joined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return <ChatRoom initialUsername={username} socketHook={socketHook} />;
};

export default Index;
