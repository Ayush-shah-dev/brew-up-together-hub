
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Conversation {
  id: string;
  recipient: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
    read: boolean;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 86400000;

    if (diff < 86400000) {
      // Today
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    } else if (diff < dayInMs * 7) {
      // Within a week
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    } else {
      // Older than a week
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  const truncateMessage = (message: string, maxLength = 40) => {
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + "...";
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
        <CardTitle className="text-lg font-medium">Messages</CardTitle>
      </CardHeader>
      <div className="px-4 py-2">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <Separator />
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="py-4 px-3 text-center text-muted-foreground">
              {searchQuery ? "No conversations matching your search" : "No conversations yet"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const isUnread = !conversation.lastMessage.read && 
                  conversation.lastMessage.senderId !== currentUserId;
                
                return (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className={`w-full justify-start px-3 py-2 h-auto ${
                      isActive ? "bg-cobrew-50" : ""
                    } ${isUnread ? "font-semibold" : ""}`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                        <AvatarImage src={conversation.recipient.avatarUrl} />
                        <AvatarFallback className="bg-cobrew-100 text-cobrew-800">
                          {getInitials(conversation.recipient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow text-left min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium truncate max-w-[120px]">
                            {conversation.recipient.name}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatLastMessageDate(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <p
                            className={`text-xs truncate ${
                              isUnread ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {conversation.lastMessage.senderId === currentUserId ? "You: " : ""}
                            {truncateMessage(conversation.lastMessage.content)}
                          </p>
                          {isUnread && (
                            <div className="h-2 w-2 bg-cobrew-600 rounded-full ml-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
