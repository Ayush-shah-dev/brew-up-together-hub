
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MessageThreadProps {
  recipientId: string;
  recipient: User;
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const MessageThread = ({
  recipientId,
  recipient,
  currentUser,
  messages,
  onSendMessage,
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // After Supabase integration, this will call the actual send message function
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-3 shadow-sm">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipient.avatarUrl} />
            <AvatarFallback className="bg-cobrew-100 text-cobrew-800">
              {getInitials(recipient.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="ml-3 text-lg font-medium">
            {recipient.name}
          </CardTitle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-grow p-0 flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={recipient.avatarUrl} />
                        <AvatarFallback className="bg-cobrew-100 text-cobrew-800 text-xs">
                          {getInitials(recipient.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? "bg-cobrew-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-cobrew-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageDate(message.timestamp)}
                      </div>
                    </div>
                    {isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatarUrl} />
                        <AvatarFallback className="bg-cobrew-100 text-cobrew-800 text-xs">
                          {getInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={endOfMessagesRef} />
        </div>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !newMessage.trim()} 
              className="bg-cobrew-600 hover:bg-cobrew-700"
            >
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
