const mongoose = require('mongoose');

// Schema cho từng tin nhắn
const messageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isBot: {
        type: Boolean,
        default: false
    },
    query: String,
    feedback: {
        type: Number,
        enum: [0, 1, null],
        default: null
    },
    responseStats: {
        type: Object,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Schema cho cuộc trò chuyện
const conversationSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Chat'
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Tạo text index cho tìm kiếm
conversationSchema.index({ 'title': 'text', 'messages.text': 'text' });

module.exports = mongoose.model('Conversation', conversationSchema); 