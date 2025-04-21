
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ConversationList from "@/components/messaging/ConversationList";
import MessageThread from "@/components/messaging/MessageThread";

// Mock conversation data - will be replaced with Supabase data
const MOCK_CONVERSATIONS = [
  {
    id: "conv1",
    recipient: {
      id: "user1",
      name: "David Chen",
      avatarUrl: "",
    },
    lastMessage: {
      content: "Hey, I saw your project and I'm interested in the ML Engineer role. Do you have time to chat about it?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      senderId: "user1",
      read: false,
    },
  },
  {
    id: "conv2",
    recipient: {
      id: "user2",
      name: "Sofia Rodriguez",
      avatarUrl: "",
    },
    lastMessage: {
      content: "Thanks for accepting my application! When is our next team meeting?",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: "currentUser",
      read: true,
    },
  },
  {
    id: "conv3",
    recipient: {
      id: "user3",
      name: "Nathan Park",
      avatarUrl: "",
    },
    lastMessage: {
      content: "I'd like to discuss your application to the Mental Health Tracker project.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      senderId: "user3",
      read: true,
    },
  },
];

// Mock messages for each conversation
const MOCK_MESSAGES = {
  conv1: [
    {
      id: "msg1-1",
      content: "Hey, I saw your project and I'm interested in the ML Engineer role. Do you have time to chat about it?",
      senderId: "user1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
  ],
  conv2: [
    {
      id: "msg2-1",
      content: "Hi Sofia, I'm really excited to join your AR Educational Platform project!",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg2-2",
      content: "Welcome to the team! We're glad to have you on board. What aspects of AR development are you most interested in?",
      senderId: "user2",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg2-3",
      content: "I'm particularly interested in interactive 3D visualizations and have some experience with Unity. I'd love to work on making complex scientific concepts more engaging through AR.",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg2-4",
      content: "That's perfect! We're planning to use Unity for our prototype. Do you have availability for a kick-off meeting next week?",
      senderId: "user2",
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg2-5",
      content: "Thanks for accepting my application! When is our next team meeting?",
      senderId: "currentUser",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  conv3: [
    {
      id: "msg3-1",
      content: "Hi Alex, I noticed your application to our Mental Health Tracker project. I was impressed by your experience.",
      senderId: "user3",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg3-2",
      content: "I'd like to discuss your application to the Mental Health Tracker project.",
      senderId: "user3",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
};

// Mock current user
const MOCK_CURRENT_USER = {
  id: "currentUser",
  name: "Alex Johnson",
  avatarUrl: "",
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading messages data
    const loadMessagesData = async () => {
      try {
        // After Supabase integration, this will fetch actual conversations and user data
        setTimeout(() => {
          setConversations(MOCK_CONVERSATIONS);
          setCurrentUser(MOCK_CURRENT_USER);
          
          // Set the first conversation as active by default
          if (MOCK_CONVERSATIONS.length > 0) {
            setActiveConversationId(MOCK_CONVERSATIONS[0].id);
            setActiveConversation(MOCK_CONVERSATIONS[0]);
            setMessages(MOCK_MESSAGES[MOCK_CONVERSATIONS[0].id] || []);
          }
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading messages:", error);
        setIsLoading(false);
      }
    };

    loadMessagesData();
  }, []);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    const selectedConversation = conversations.find(conv => conv.id === conversationId);
    setActiveConversation(selectedConversation);
    setMessages(MOCK_MESSAGES[conversationId] || []);
    
    // Mark conversation as read when selected
    // This would be replaced with a call to the Supabase backend
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId && conv.lastMessage.senderId !== currentUser.id
          ? {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                read: true
              }
            }
          : conv
      )
    );
  };

  const handleSendMessage = async (content) => {
    if (!activeConversationId || !content.trim()) return;
    
    // Create a new message
    const newMessage = {
      id: `new-${Date.now()}`, // Temporary ID until Supabase provides a real one
      content,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Add message to the current conversation
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Update the last message in the conversation list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === activeConversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date().toISOString(),
                senderId: currentUser.id,
                read: false,
              }
            }
          : conv
      )
    );
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Here would be the call to Supabase to save the message
    return Promise.resolve();
  };

  return (
    <Layout isAuthenticated={true} userProfile={currentUser}>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-gray-600">
              Connect with project owners and team members
            </p>
          </div>
          
          {isLoading ? (
            <div className="bg-white shadow rounded-lg h-[calc(100vh-240px)] flex">
              <div className="w-1/3 border-r h-full animate-pulse">
                <div className="h-full bg-gray-200"></div>
              </div>
              <div className="w-2/3 h-full animate-pulse">
                <div className="h-full bg-gray-100"></div>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
              <p className="text-gray-600 mb-6">
                Start conversations by applying to projects or when others apply to join your projects
              </p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg h-[calc(100vh-240px)] flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 border-r h-full">
                <ConversationList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  currentUserId={currentUser.id}
                />
              </div>
              <div className="w-full md:w-2/3 h-full">
                {activeConversation ? (
                  <MessageThread
                    recipientId={activeConversation.recipient.id}
                    recipient={activeConversation.recipient}
                    currentUser={currentUser}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center p-4 text-center text-gray-500">
                    <p>Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
