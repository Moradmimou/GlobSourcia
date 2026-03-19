import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Send, 
  User, 
  Users,
  MessageSquare, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  ChevronLeft,
  Plus,
  Clock,
  Tag,
  Paperclip,
  Image as ImageIcon,
  File as FileIcon,
  X,
  Check,
  CheckCheck,
  Download
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc,
  getDocs,
  limit,
  increment,
  arrayUnion
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, OperationType, handleFirestoreError } from '../firebase';
import { Chat, Message, User as UserType } from '../types';
import { cn } from '../lib/utils';

import { format, isToday, isYesterday } from 'date-fns';

interface ChatViewProps {
  currentUser: UserType;
  t: (key: string) => string;
  isFloating?: boolean;
  initialRelatedId?: string | number;
  initialRelatedType?: 'RFQ' | 'Order' | 'Shipment' | 'Invoice';
}

export default function ChatView({ 
  currentUser, 
  t, 
  isFloating = false,
  initialRelatedId,
  initialRelatedType
}: ChatViewProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [potentialPartners, setPotentialPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; preview: string; type: 'image' | 'file' } | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUser.uid || !auth.currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setChats(chatList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'chats');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (initialRelatedId && chats.length > 0 && !activeChat) {
      const relevantChat = chats.find(c => 
        c.relatedId === initialRelatedId && 
        c.relatedType === initialRelatedType
      );
      if (relevantChat) {
        setActiveChat(relevantChat);
      }
    }
  }, [initialRelatedId, initialRelatedType, chats]);

  useEffect(() => {
    if (!activeChat) return;

    // Mark as read and clear unread count
    if (activeChat.unreadCount?.[currentUser.uid as string]) {
      updateDoc(doc(db, 'chats', activeChat.id), {
        [`unreadCount.${currentUser.uid}`]: 0
      });
    }

    const q = query(
      collection(db, `chats/${activeChat.id}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messageList);

      // Update read receipts for messages not sent by me
      snapshot.docs.forEach(msgDoc => {
        const data = msgDoc.data();
        if (data.senderId !== currentUser.uid && (!data.readBy || !data.readBy.includes(currentUser.uid as string))) {
          updateDoc(doc(db, `chats/${activeChat.id}/messages`, msgDoc.id), {
            readBy: arrayUnion(currentUser.uid)
          });
        }
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `chats/${activeChat.id}/messages`);
    });

    return () => unsubscribe();
  }, [activeChat?.id, currentUser.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchPotentialPartners = async () => {
    try {
      const res = await fetch('/api/users/chat-partners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setPotentialPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleTyping = () => {
    if (!activeChat || !currentUser.uid) return;

    if (!isTyping) {
      setIsTyping(true);
      updateDoc(doc(db, 'chats', activeChat.id), {
        [`typing.${currentUser.uid}`]: true
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateDoc(doc(db, 'chats', activeChat.id), {
        [`typing.${currentUser.uid}`]: false
      });
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    setAttachment({
      file,
      preview: isImage ? URL.createObjectURL(file) : '',
      type: isImage ? 'image' : 'file'
    });
  };

  const startNewChat = async (partner: any, relatedId?: string | number, relatedType?: 'RFQ' | 'Order' | 'Shipment' | 'Invoice') => {
    const existingChat = chats.find(c => 
      c.participants.includes(partner.uid) && 
      c.relatedId === (relatedId || null) && 
      c.relatedType === (relatedType || null)
    );
    
    if (existingChat) {
      setActiveChat(existingChat);
      setShowNewChatModal(false);
      return;
    }

    try {
      const chatData = {
        participants: [currentUser.uid, partner.uid],
        participantDetails: {
          [currentUser.uid as string]: {
            name: currentUser.name,
            role: currentUser.role,
            avatar_url: currentUser.avatar_url
          },
          [partner.uid]: {
            name: partner.name,
            role: partner.role,
            avatar_url: partner.avatar_url
          }
        },
        relatedId: relatedId || null,
        relatedType: relatedType || null,
        lastMessage: '',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        typing: {
          [currentUser.uid as string]: false,
          [partner.uid]: false
        },
        unreadCount: {
          [currentUser.uid as string]: 0,
          [partner.uid]: 0
        }
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);
      setActiveChat({ id: docRef.id, ...chatData } as any);
      setShowNewChatModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !activeChat || !currentUser.uid) return;

    const messageText = newMessage.trim();
    const currentAttachment = attachment;
    
    setNewMessage('');
    setAttachment(null);
    setUploading(true);

    try {
      let fileUrl = '';
      let fileName = '';
      let fileSize = 0;

      if (currentAttachment) {
        const storageRef = ref(storage, `chats/${activeChat.id}/${Date.now()}_${currentAttachment.file.name}`);
        await uploadBytes(storageRef, currentAttachment.file);
        fileUrl = await getDownloadURL(storageRef);
        fileName = currentAttachment.file.name;
        fileSize = currentAttachment.file.size;
      }

      const messageData = {
        senderId: currentUser.uid,
        text: messageText,
        type: currentAttachment ? currentAttachment.type : 'text',
        fileUrl,
        fileName,
        fileSize,
        createdAt: serverTimestamp(),
        readBy: [currentUser.uid]
      };

      await addDoc(collection(db, `chats/${activeChat.id}/messages`), messageData);
      
      const partnerId = activeChat.participants.find(id => id !== currentUser.uid);
      
      await updateDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: messageText || (currentAttachment?.type === 'image' ? 'Sent an image' : 'Sent a file'),
        updatedAt: serverTimestamp(),
        [`unreadCount.${partnerId}`]: increment(1),
        [`typing.${currentUser.uid}`]: false
      });
      
      setIsTyping(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chats/${activeChat.id}`);
    } finally {
      setUploading(false);
    }
  };

  const getPartnerDetails = (chat: Chat) => {
    const partnerId = chat.participants.find(id => id !== currentUser.uid);
    return chat.participantDetails[partnerId as string] || { name: 'Unknown', role: 'user' };
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const filteredChats = chats.filter(chat => {
    const partner = getPartnerDetails(chat);
    return partner.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={cn(
      "flex bg-white dark:bg-zinc-950 overflow-hidden",
      isFloating ? "h-full w-full" : "h-[calc(100dvh-120px)] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
    )}>
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50",
        activeChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{t('messages')}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-1">Inbox</p>
            </div>
            <button 
              onClick={() => {
                fetchPotentialPartners();
                setShowNewChatModal(true);
              }}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {initialRelatedId && !activeChat && !chats.some(c => c.relatedId === initialRelatedId) && (
            <div className="p-4 m-4 bg-zinc-900 dark:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-900/10">
              <p className="text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.2em]">Context: {initialRelatedType} #{initialRelatedId}</p>
              <button 
                onClick={() => {
                  fetchPotentialPartners();
                  setShowNewChatModal(true);
                }}
                className="w-full py-3 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                Start Chat
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-10 h-10 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('loading')}</p>
            </div>
          ) : filteredChats.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredChats.map((chat) => {
                const partner = getPartnerDetails(chat);
                const partnerId = chat.participants.find(id => id !== currentUser.uid);
                const partnerTyping = chat.typing?.[partnerId as string];
                const unreadCount = chat.unreadCount?.[currentUser.uid as string] || 0;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={cn(
                      "w-full p-5 flex items-start space-x-4 transition-all text-left group",
                      activeChat?.id === chat.id 
                        ? "bg-white dark:bg-zinc-900 shadow-inner" 
                        : "hover:bg-zinc-900 dark:hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      {partner.avatar_url ? (
                        <img src={partner.avatar_url} alt={partner.name} className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors",
                          activeChat?.id === chat.id ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 group-hover:bg-white group-hover:text-zinc-900 dark:group-hover:bg-zinc-700 dark:group-hover:text-white"
                        )}>
                          {partner.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={cn(
                          "font-bold truncate transition-colors",
                          activeChat?.id === chat.id ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300 group-hover:text-white"
                        )}>{partner.name}</h3>
                        {chat.updatedAt && (
                          <span className={cn(
                            "text-[9px] font-mono uppercase tracking-wider",
                            activeChat?.id === chat.id ? "text-zinc-400" : "text-zinc-400 group-hover:text-zinc-500"
                          )}>
                            {format((chat.updatedAt as any).toDate(), 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em] transition-colors",
                          activeChat?.id === chat.id ? "text-zinc-400" : "text-zinc-500 group-hover:text-zinc-400"
                        )}>{t(partner.role)}</p>
                        {unreadCount > 0 && (
                          <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-black px-2 py-0.5 rounded-full group-hover:bg-white dark:group-hover:bg-zinc-200 group-hover:text-zinc-900 transition-colors">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs truncate transition-colors",
                        partnerTyping 
                          ? "text-emerald-500 font-bold italic" 
                          : (activeChat?.id === chat.id ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-300")
                      )}>
                        {partnerTyping ? "Typing..." : (chat.lastMessage || 'No messages yet')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-zinc-900 dark:text-white font-bold mb-2">No messages yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] leading-relaxed">Start a conversation with your sourcing or shipping partners.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white dark:bg-zinc-950",
        !activeChat ? "hidden md:flex" : "flex"
      )}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 dark:text-white" />
                </button>
                <div className="relative">
                  {getPartnerDetails(activeChat).avatar_url ? (
                    <img src={getPartnerDetails(activeChat).avatar_url} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white font-black text-lg">
                      {getPartnerDetails(activeChat).name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-zinc-900 dark:text-white tracking-tight">{getPartnerDetails(activeChat).name}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                      {activeChat.typing?.[activeChat.participants.find(id => id !== currentUser.uid) as string] ? 'Typing...' : 'Online'}
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{t(getPartnerDetails(activeChat).role)}</span>
                    {activeChat.relatedId && (
                      <>
                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                          <Tag className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                          <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-[0.2em]">
                            {activeChat.relatedType || 'Ref'}: #{activeChat.relatedId}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-900/10">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser.uid;
                const showAvatar = idx === 0 || messages[idx-1].senderId !== msg.senderId;
                const showDate = idx === 0 || formatMessageDate((messages[idx-1].createdAt as any).toDate()) !== formatMessageDate((msg.createdAt as any).toDate());
                const isRead = msg.readBy && msg.readBy.length > 1;

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-8">
                        <span className="px-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[9px] font-black rounded-full uppercase tracking-[0.2em] shadow-sm">
                          {formatMessageDate((msg.createdAt as any).toDate())}
                        </span>
                      </div>
                    )}
                    <div className={cn(
                      "flex items-end space-x-3",
                      isMe ? "flex-row-reverse space-x-reverse" : "flex-row"
                    )}>
                      {!isMe && (
                        <div className={cn("w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-black overflow-hidden shadow-sm", !showAvatar && "opacity-0")}>
                          {getPartnerDetails(activeChat).avatar_url ? (
                            <img src={getPartnerDetails(activeChat).avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getPartnerDetails(activeChat).name.charAt(0)
                          )}
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[75%] flex flex-col",
                        isMe ? "items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          isMe 
                            ? "bg-zinc-900 dark:bg-zinc-800 text-white rounded-br-none" 
                            : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-bl-none"
                        )}>
                          {msg.type === 'image' && msg.fileUrl && (
                            <div className="relative group mb-3">
                              <img src={msg.fileUrl} alt="Sent image" className="max-w-full rounded-xl cursor-pointer hover:opacity-95 transition-all" onClick={() => window.open(msg.fileUrl, '_blank')} />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                                <Download className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                          {msg.type === 'file' && msg.fileUrl && (
                            <div className={cn(
                              "flex items-center space-x-4 p-3 rounded-xl mb-3 border transition-colors",
                              isMe ? "bg-white/10 border-white/10 hover:bg-white/20" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            )}>
                              <div className={cn(
                                "p-2.5 rounded-lg",
                                isMe ? "bg-white/20 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                              )}>
                                <FileIcon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-xs font-black truncate", isMe ? "text-white" : "text-zinc-900 dark:text-white")}>{msg.fileName}</p>
                                <p className={cn("text-[10px] font-mono", isMe ? "text-white/60" : "text-zinc-500 dark:text-zinc-400")}>
                                  {(msg.fileSize || 0) / 1024 > 1024 ? `${((msg.fileSize || 0) / 1048576).toFixed(1)} MB` : `${((msg.fileSize || 0) / 1024).toFixed(1)} KB`}
                                </p>
                              </div>
                              <button 
                                onClick={() => window.open(msg.fileUrl, '_blank')}
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  isMe ? "hover:bg-white/20 text-white" : "hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-400"
                                )}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {msg.text && <p className="font-medium">{msg.text}</p>}
                        </div>
                        <div className={cn(
                          "text-[9px] mt-2 flex items-center space-x-2 font-mono uppercase tracking-wider",
                          isMe ? "text-zinc-400" : "text-zinc-400"
                        )}>
                          <span>{msg.createdAt && format((msg.createdAt as any).toDate(), 'HH:mm')}</span>
                          {isMe && (
                            <span className={cn(isRead ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")}>
                              {isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              {attachment && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center space-x-4">
                    {attachment.type === 'image' ? (
                      <img src={attachment.preview} alt="Preview" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl flex items-center justify-center shadow-sm">
                        <FileIcon className="w-7 h-7" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-black text-zinc-900 dark:text-white truncate">{attachment.file.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">{(attachment.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAttachment(null)}
                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
              <form onSubmit={sendMessage} className="flex items-center space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-all active:scale-95"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !attachment) || uploading}
                  className="p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-zinc-900/20 dark:shadow-white/10 active:scale-95"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 dark:shadow-none flex items-center justify-center mb-8 border border-zinc-100 dark:border-zinc-800">
              <MessageSquare className="w-10 h-10 text-zinc-900 dark:text-white" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">Select a conversation</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto text-sm leading-relaxed font-medium">
              Choose a contact from the list to start chatting or click the plus icon to find new partners.
            </p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">New Chat</h3>
                  {initialRelatedId ? (
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-1">
                      Regarding {initialRelatedType} #{initialRelatedId}
                    </p>
                  ) : (
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-1">Start a conversation</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowNewChatModal(false)}
                  className="p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
              <div className="p-4 max-h-[450px] overflow-y-auto bg-white dark:bg-zinc-950">
                {potentialPartners.length > 0 ? (
                  <div className="space-y-2">
                    {potentialPartners.map((partner) => (
                      <button
                        key={partner.uid}
                        onClick={() => startNewChat(partner, initialRelatedId, initialRelatedType)}
                        className="w-full p-5 flex items-center space-x-5 hover:bg-zinc-900 dark:hover:bg-zinc-900 hover:text-white rounded-[2rem] transition-all group border border-transparent hover:shadow-xl hover:shadow-zinc-900/10"
                      >
                        <div className="relative flex-shrink-0">
                          {partner.avatar_url ? (
                            <img src={partner.avatar_url} alt={partner.name} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white font-black text-xl group-hover:bg-white/10 group-hover:text-white transition-colors">
                              {partner.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="font-black text-zinc-900 dark:text-white group-hover:text-white transition-colors truncate">{partner.name}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] mt-0.5 group-hover:text-zinc-400 transition-colors">{t(partner.role)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center px-8">
                    <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Users className="w-10 h-10 text-zinc-200 dark:text-zinc-800" />
                    </div>
                    <h4 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">No Active Partners</h4>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                      We couldn't find any eligible chat partners for your current role.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
