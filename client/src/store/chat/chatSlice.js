import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { marked } from "marked";
import DOMPurify from 'dompurify';


const initData = {
    data: [],
    isModalOpen: false,
    activeChatId: null
}
/*
data:[
    {
        id: 1,
        title: 'qweqweqw,
        messages: [
            {id: 1, text: 'react là gì', isBot: false},
            {id: 2, text: 'react là lib của js', isBot: true},
        ]
        
    }
]
*/
const ChatSlice = createSlice({
    name: 'chat',
    initialState: initData,
    reducers:{
        addChat: (state, action) => {
            const newChatId = uuidv4();
            const initialMessage = action.payload?.message || null;
            
            state.data.push({
                id: newChatId,
                title: 'Chat',
                messages: initialMessage ? [initialMessage] : []
            });
            state.activeChatId = newChatId;
            state.isModalOpen = true;
        },
        addMessage: (state, action) => {
            const { message, chatId } = action.payload;
            const chat = state.data?.find((chat) => chat.id === chatId);
            
            if(chat && message) {
                // Nếu là tin nhắn bot, cần xử lý markdown và sanitize
                if (message.isBot && message.text) {
                    const messageFormat = marked.parse(message.text);
                    const safeChat = DOMPurify.sanitize(messageFormat);
                    message.text = safeChat;
                }
                
                // Thêm tin nhắn vào chat
                chat.messages.push(message);
            }
        },
        setMessageFeedback: (state, action) => {
            const { messageId, feedbackType, chatId } = action.payload;
            const chat = state.data.find(chat => chat.id === chatId);
            if (chat) {
                const message = chat.messages.find(msg => msg.id === messageId);
                if (message && message.isBot) {
                    // Chỉ cập nhật phản hồi cho tin nhắn bot
                    message.feedback = feedbackType;
                }
            }
        },
        removeChat: (state, action) =>{
            state.data = state.data.filter((chat) => chat.id !== action.payload);
            if (state.activeChatId === action.payload) {
                state.activeChatId = state.data.length > 0 ? state.data[0].id : null;
            }
        },
        setNameChat: (state, action) =>{
            const { chatTitle, chatId } = action.payload;
            const chat = state.data.find((chat) => chat.id === chatId)
            if(chat){
                chat.title = chatTitle;
            }
        },
        setModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
        },
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload;
            if (action.payload) {
                state.isModalOpen = true;
            }
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        }
    }
})

export const { 
    addChat, 
    removeChat, 
    addMessage, 
    setNameChat, 
    setModalOpen,
    setActiveChatId,
    closeModal,
    setMessageFeedback
} = ChatSlice.actions;

export default ChatSlice.reducer;