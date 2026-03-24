import { useState } from "react";
import JoinScreen from "@/components/chat/JoinScreen";
import ChatRoom from "@/components/chat/ChatRoom";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  useTheme();

  const handleJoin = (name: string) => {
    setUsername(name);
    setJoined(true);
  };

  if (!joined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return <ChatRoom initialUsername={username} />;
};

export default Index;
