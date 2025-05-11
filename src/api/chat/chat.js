import api from "../axiosInstance";

export const createConversation = async (userId) => {
    console.log("userId", userId);
  const response = await api.post('/messages', { userId });
  return response.data;
};

export const getConversations = async (patientId) => {
  const response = await api.get(`/messages/${patientId}`);
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/${conversationId}/messages`);
  return response.data;
};

export const addMessage = async (conversationId, message) => {
  const response = await api.post(`/messages/${conversationId}/messages`, message);
  return response.data;
}; 