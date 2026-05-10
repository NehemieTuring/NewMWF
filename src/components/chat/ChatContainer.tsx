"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./chat.module.css";
import { chatService, ChatMessage } from "@/services/chatService";
import { webSocketService } from "@/services/webSocketService";
import { useAuth } from "@/context/AuthContext";

interface ChatContainerProps {
  title?: string;
}

export default function ChatContainer({ title = "Messagerie" }: ChatContainerProps) {
  const { user: authUser } = useAuth();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [refreshing, setRefreshing] = useState(false);

  const GROUP_CONV = { id: null, firstName: "Groupe", name: "Général", username: "group", isGroup: true };

  const initChat = async () => {
    setRefreshing(true);
    try {
      const [convs, members] = await Promise.all([
        chatService.getConversations(),
        chatService.getMembers()
      ]);
      setConversations([GROUP_CONV, ...convs]);
      setMemberList(members);
      if (!activeConv) setActiveConv(GROUP_CONV);
    } catch (err) {
      console.error("Failed to init chat", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    initChat();

    // Heartbeat to keep user online
    const heartbeat = setInterval(() => {
        chatService.getUnreadCount(); // This endpoint updates lastSeen on backend
    }, 120000); // 2 minutes

    return () => clearInterval(heartbeat);
  }, []);

  useEffect(() => {
    if (authUser?.id) {
      webSocketService.connect(
        authUser.id,
        (msg) => { 
          // Private message
          if (activeConv?.id === msg.sender?.id || activeConv?.id === msg.receiver?.id) {
             setMessages(prev => {
                // If this is the message we just sent (optimistic), replace it
                const existingIndex = prev.findIndex(m => m.isPending && m.message === msg.message);
                if (existingIndex !== -1) {
                    const newMsgs = [...prev];
                    newMsgs[existingIndex] = msg;
                    return newMsgs;
                }
                return prev.find(m => m.id === msg.id) ? prev : [...prev, msg];
             });
             // Mark as read immediately if it's from others and we are in the conversation
             if (activeConv?.id === msg.sender?.id) {
                chatService.markAsRead(msg.id);
             }
          } else {
             // Notify sidebar of new message in other conversation
             setConversations(prev => prev.map(c => 
                c.id === msg.sender?.id ? { ...c, unread: (c.unread || 0) + 1, lastMessage: msg.message } : c
             ));
          }
        },
        (msg) => { 
          // Group message
          if (activeConv?.isGroup) {
              setMessages(prev => {
                  const existingIndex = prev.findIndex(m => m.isPending && m.message === msg.message);
                  if (existingIndex !== -1) {
                      const newMsgs = [...prev];
                      newMsgs[existingIndex] = msg;
                      return newMsgs;
                  }
                  return prev.find(m => m.id === msg.id) ? prev : [...prev, msg];
              });
          } else {
              setConversations(prev => prev.map(c => 
                 c.isGroup ? { ...c, unread: (c.unread || 0) + 1, lastMessage: msg.message } : c
              ));
          }
        },
        (update) => {
          // Edit/Delete
          if (update.action === "DELETE") {
            setMessages(prev => prev.filter(m => m.id !== update.id));
          } else {
            setMessages(prev => prev.map(m => m.id === update.id ? update : m));
          }
        },
        (statusUpdate) => {
          // User Status Update (Online/Offline)
          const updateFn = (list: any[]) => list.map(u => 
            u.id === statusUpdate.userId ? { ...u, lastSeen: statusUpdate.lastSeen } : u
          );
          setConversations(prev => updateFn(prev));
          setMemberList(prev => updateFn(prev));
          if (activeConv?.id === statusUpdate.userId) {
              setActiveConv((prev: any) => ({ ...prev, lastSeen: statusUpdate.lastSeen }));
          }
        },
        (unreadCount) => {
           // Global unread count Update (not used locally in ChatContainer but good to have)
           // If we had a global state for total unread, we'd update it here
        }
      );
      return () => webSocketService.disconnect();
    }
  }, [authUser, activeConv]);

  useEffect(() => {
    async function loadMessages() {
      try {
        let data;
        if (activeConv?.isGroup) {
          data = await chatService.getGroupMessages();
          setMessages((data.content || []).reverse());
        } else if (activeConv) {
          data = await chatService.getMessages(activeConv.id);
          setMessages((data.content || []).reverse());
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }
    loadMessages();
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() && !editingMessage) return;

    const currentText = messageText;
    setMessageText("");

    try {
      if (editingMessage) {
        // Edit doesn't need optimistic UI as much, but we could do it
        await chatService.editMessage(editingMessage.id, currentText);
        setEditingMessage(null);
      } else {
        // OPTIMISTIC UI: Add message locally immediately
        const tempId = Date.now();
        const optimisticMsg: ChatMessage = {
            id: tempId,
            sender: {
                id: authUser?.id || 0,
                firstName: (authUser as any)?.firstName || "",
                name: (authUser as any)?.name || "",
                username: authUser?.username || "",
                email: authUser?.email || ""
            },
            message: currentText,
            createdAt: new Date().toISOString(),
            edited: false,
            read: false,
            isPending: true
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const receiverId = activeConv?.isGroup ? null : activeConv?.id;
        await chatService.sendMessage(receiverId, currentText);
      }
    } catch (err) {
      console.error("Failed to send/edit message", err);
      // Rollback if needed (optional: remove pending message or show error)
      setMessageText(currentText);
      if (!editingMessage) {
          setMessages(prev => prev.filter(m => !m.isPending || m.message !== currentText));
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await chatService.uploadFile(file);
      const receiverId = activeConv?.isGroup ? null : activeConv?.id;
      await chatService.sendMessage(receiverId, `📎 ${file.name}`, uploadRes.url, uploadRes.type);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Échec de l'envoi du fichier.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStartChat = (member: any) => {
    const existing = conversations.find(c => c.id === member.id && !c.isGroup);
    if (existing) {
      setActiveConv(existing);
    } else {
      const newConv = { ...member, isGroup: false };
      setConversations(prev => [GROUP_CONV, newConv, ...prev.filter(c => c.id !== null && c.id !== member.id)]);
      setActiveConv(newConv);
    }
    setShowNewChatModal(false);
  };

  const filteredConversations = conversations.filter(c => 
    (c.firstName + " " + (c.name || "")).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = memberList.filter(m => 
    (m.firstName + " " + (m.name || "")).toLowerCase().includes(searchQuery.toLowerCase()) &&
    m.id !== authUser?.id
  );

  const isOnline = (user: any) => {
    if (!user || user.isGroup) return false;
    if (!user.lastSeen) return false;
    const lastSeenDate = new Date(user.lastSeen).getTime();
    const now = new Date().getTime();
    // Consider online if active in the last 3 minutes
    return (now - lastSeenDate) < 3 * 60 * 1000;
  };

  if (loading) return <div className={styles.loading}><i className="fas fa-spinner fa-spin"></i></div>;

  return (
    <div className={styles.chatPage}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTop}>
            <h2>{title}</h2>
            <div className={styles.headerActions}>
              <button className={`${styles.iconBtn} ${refreshing ? styles.spinning : ""}`} onClick={initChat} title="Actualiser">
                <i className="fas fa-sync-alt"></i>
              </button>
              <button className={styles.newChatBtn} onClick={() => setShowNewChatModal(true)} title="Nouvelle discussion">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div className={styles.searchBar}>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.convList}>
          {filteredConversations.map((conv) => (
            <div 
              key={conv.isGroup ? "group" : conv.id} 
              className={`${styles.convItem} ${activeConv?.id === conv.id && activeConv?.isGroup === conv.isGroup ? styles.convItemActive : ""}`}
              onClick={() => { setActiveConv(conv); setEditingMessage(null); setMessageText(""); }}
            >
              <div className={styles.avatarContainer}>
                <div className={`${styles.avatar} ${conv.isGroup ? styles.groupAvatar : ""}`}>
                  {conv.isGroup ? <i className="fas fa-users"></i> : (conv.firstName?.[0] || "U")}
                </div>
                {isOnline(conv) && <div className={styles.onlineStatus}></div>}
                {conv.unread > 0 && <div className={styles.unreadBadge}>{conv.unread}</div>}
              </div>
              <div className={styles.convInfo}>
                <span className={styles.convName}>{conv.firstName} {conv.name || ""}</span>
                <p className={styles.lastMsg}>{conv.lastMessage || (isOnline(conv) ? "En ligne" : `@${conv.username || "membre"}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chatArea}>
        {activeConv ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.activeMember}>
                <div className={`${styles.avatarSmall} ${activeConv.isGroup ? styles.groupAvatarSmall : ""}`}>
                   {activeConv.isGroup ? <i className="fas fa-users"></i> : (activeConv.firstName?.[0] || "U")}
                </div>
                <div>
                  <h3>{activeConv.firstName} {activeConv.name || ""}</h3>
                  <div className={`${styles.statusText} ${!activeConv.isGroup && !isOnline(activeConv) ? styles.statusOffline : ""}`}>
                    {activeConv.isGroup ? "Discussion de groupe" : (isOnline(activeConv) ? "En ligne" : "Hors ligne")}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.messagesList}>
              {messages.map((msg) => {
                const isMine = !!authUser?.id && !!msg.sender?.id && (msg.sender.id === authUser.id || msg.sender.email === authUser.email);
                return (
                  <div key={msg.id} className={`${styles.messageOuter} ${isMine ? styles.myMsgOuter : ""}`}>
                    {!isMine && activeConv.isGroup && <span className={styles.senderName}>{msg.sender.firstName}</span>}
                    <div className={`${styles.messageWrapper} ${isMine ? styles.myMsgWrapper : ""}`}>
                      <div className={`${styles.message} ${isMine ? styles.myMsg : styles.otherMsg}`}>
                        {msg.attachmentUrl && (
                          <div className={styles.attachment}>
                             {msg.attachmentType?.startsWith("image/") ? (
                               <img src={`http://localhost:8080${msg.attachmentUrl}`} alt="Attachment" className={styles.attachImage} />
                             ) : (
                               <a href={`http://localhost:8080${msg.attachmentUrl}`} target="_blank" className={styles.attachFile}>
                                 <i className="fas fa-file-download"></i>
                                 <span>{msg.message.replace("📎 ", "")}</span>
                               </a>
                             )}
                          </div>
                        )}
                        {!msg.attachmentUrl && <p>{msg.message}</p>}
                        <div className={styles.msgMeta}>
                          {msg.edited && <span className={styles.editedTag}>modifié</span>}
                          <span className={styles.msgTime}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      {isMine && (
                        <div className={styles.msgActions}>
                          {!msg.attachmentUrl && <button onClick={() => { setEditingMessage(msg); setMessageText(msg.message); }}><i className="fas fa-pen"></i></button>}
                          <button onClick={async () => confirm("Supprimer ?") && await chatService.deleteMessage(msg.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatFooter}>
                {editingMessage && (
                  <div className={styles.editBar}>
                    <span>Modification...</span>
                    <button onClick={() => { setEditingMessage(null); setMessageText(""); }}><i className="fas fa-times"></i></button>
                  </div>
                )}
                <div className={styles.controlsWrapper}>
                  <button className={styles.attachBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paperclip"></i>}
                  </button>
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
                  <div className={styles.inputContainer}>
                    <input type="text" placeholder="Message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                  </div>
                  <button className={styles.sendBtn} onClick={handleSend} disabled={!messageText.trim() && !editingMessage}>
                    <i className={editingMessage ? "fas fa-check" : "fas fa-paper-plane"}></i>
                  </button>
                </div>
            </div>
          </>
        ) : (
          <div className={styles.noActiveConv}><i className="fas fa-comments"></i><h3>Messagerie</h3></div>
        )}
      </div>

      {showNewChatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.membersModal}>
            <div className={styles.modalHeader}>
              <h3>Nouvelle Discussion</h3>
              <button onClick={() => setShowNewChatModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className={styles.modalBody}>
              {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                <div key={member.id} className={styles.memberSelectItem} onClick={() => handleStartChat(member)}>
                   <div className={styles.avatar}>{member.firstName?.[0]}</div>
                   <div className={styles.memberSelectInfo}>
                     <span className={styles.memberName}>{member.firstName} {member.name}</span>
                     <span className={styles.memberUsername}>@{member.username}</span>
                   </div>
                   <i className="fas fa-comment-medical"></i>
                </div>
              )) : <div className={styles.noResult}>Aucun membre trouvé</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
