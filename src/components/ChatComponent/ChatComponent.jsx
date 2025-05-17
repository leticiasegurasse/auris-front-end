import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { createConversation, getConversations, getMessages, addMessage } from '../../api/chat/chat';

const ChatComponent = ({ patientId, patientNotes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      const conversations = await getConversations(patientId);
      if (conversations && conversations.length > 0) {
        setMessages(conversations[0].messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const initializeConversation = async () => {
    try {
      // Primeiro, tenta buscar conversas existentes
      const conversations = await getConversations(patientId);
      console.log(conversations);
      
      if (conversations && conversations.length > 0) {
        // Se existir alguma conversa, usa a primeira
        setConversationId(conversations[0]._id);
        // Atualiza as mensagens diretamente da conversa
        setMessages(conversations[0].messages || []);
      } else {
        // Se não existir nenhuma conversa, cria uma nova
        const newConversation = await createConversation(patientId);
        setConversationId(newConversation._id);
      }
    } catch (error) {
      console.error('Erro ao inicializar conversa:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setIsTyping(true);
    try {
      const message = {
        sender: 'user',
        content: newMessage,
        notes: patientNotes
      };

      // Adiciona a mensagem imediatamente na interface
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');

      // Envia a mensagem para a API
      await addMessage(conversationId, message);
      
      // Atualiza as mensagens com a resposta da API
      await loadConversation();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Em caso de erro, remove a mensagem da interface
      setMessages(prevMessages => prevMessages.slice(0, -1));
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[var(--primary-color)] border-b flex justify-between items-center">
            <h3 className="font-semibold text-white">Chat com IA</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[var(--light-blue)]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatComponent; 