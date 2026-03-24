import { useState } from "react";
import JoinScreen from "@/components/chat/JoinScreen";
import ChatRoom from "@/components/chat/ChatRoom";
import { useSocket } from "@/hooks/useSocket";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { connect, username } = useSocket();
  const [joined, setJoined] = useState(false);

  // Initialize theme on mount
  useTheme();

  const handleJoin = (name: string) => {
    connect(name);
    setJoined(true);
  };

  if (!joined) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return <ChatRoom />;
};

export default Index;
