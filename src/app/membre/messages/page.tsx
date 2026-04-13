"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../membre.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { memberService } from "@/services/memberService";
import { webSocketService } from "@/services/webSocketService";
import { useAuth } from "@/context/AuthContext";

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New conversation modal
  const [showNewConv, setShowNewConv] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await memberService.getConversations().catch(() => []);
        setConversations(data);
        if (data && data.length > 0 && !activeConv) setActiveConv(data[0]);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
    
    // Connect to WebSocket for real-time messages
    if (authUser?.id) {
      webSocketService.connect(authUser.id, (newMsg: any) => {
        // If message is for active conversation, add it
        if (activeConv && (newMsg.sender.id === activeConv.id || newMsg.receiver.id === activeConv.id)) {
          setMessages(prev => [...prev.filter(m => m.id !== newMsg.id), newMsg]);
        }
        // Refresh conversations list to update previews/unread counts
        loadConversations();
      });
    }

    return () => webSocketService.disconnect();
  }, [activeConv, authUser?.id]);

  useEffect(() => {
    if (activeConv) {
      async function loadMessages() {
        try {
          const data = await memberService.getMessages(activeConv.id);
          setMessages(data);
        } catch (err) {
          console.error("Failed to load messages", err);
        }
      }
      loadMessages();
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    try {
      await memberService.sendMessage(activeConv.id, messageText);
      setMessageText("");
      const data = await memberService.getMessages(activeConv.id);
      setMessages(data);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const openNewConversation = async () => {
    setShowNewConv(true);
    try {
      const data = await memberService.getOtherMembers();
      setContacts(data || []);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  const startConversation = (contact: any) => {
    // Ensure we pick the user object if it was a Member record
    const userToChat = contact.user || contact;
    setActiveConv(userToChat);
    setShowNewConv(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const name = `${conv.firstName || ""} ${conv.name || ""} ${conv.username || ""}`.toLowerCase();
    return name.includes(searchText.toLowerCase());
  });

  const filteredContacts = contacts.filter(c => {
    const name = `${c.firstName || ""} ${c.name || ""} ${c.username || ""}`.toLowerCase();
    return name.includes(contactSearch.toLowerCase());
  });

  if (loading) return <div className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#4e73df", margin: "5rem auto", display: "block" }}></div>;

  return (
    <div className={styles.messageLayout}>
      {/* Sidebar - Conversations List */}
      <div className={styles.messageSidebar}>
        <div className={styles.messageSidebarHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Messages</h2>
            <button onClick={openNewConversation} style={{ background: "#4e73df", color: "white", border: "none", borderRadius: "10px", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }} title="Nouvelle conversation">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className={styles.searchBox}>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Rechercher..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          </div>
        </div>
        <div className={styles.convList}>
          {filteredConversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`${styles.convItem} ${activeConv?.id === conv.id ? styles.convItemActive : ""}`}
              onClick={() => setActiveConv(conv)}
            >
              <div className={styles.convAvatar}>
                {conv.firstName?.[0] || conv.username?.[0] || "U"}
              </div>
              <div className={styles.convInfo}>
                <span className={styles.convName}>{conv.firstName} {conv.name || ""}</span>
                <span className={styles.convPreview}>
                  {conv.lastMessage ? conv.lastMessage.substring(0, 30) + (conv.lastMessage.length > 30 ? "..." : "") : (conv.username ? `@${conv.username}` : (conv.email ? conv.email.split('@')[0] : "membre"))}
                </span>
              </div>
              <div className={styles.convMeta}>
                <span className={styles.convTime}>{conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                {conv.unreadCount > 0 && (
                  <span style={{ background: "#e74a3b", color: "white", borderRadius: "50%", minWidth: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredConversations.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#858796" }}>
              Aucune conversation trouvée.
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={styles.chatWindow}>
        {activeConv ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.convAvatar} style={{ width: "40px", height: "40px", fontSize: "0.9rem" }}>
                {activeConv.firstName?.[0] || "U"}
              </div>
              <div className={styles.chatHeaderInfo}>
                <h3>{activeConv.firstName} {activeConv.name || ""}</h3>
                <span className={styles.chatHeaderStatus}>En ligne</span>
              </div>
            </div>

            <div className={styles.messagesArea}>
              {messages.map((msg) => {
                const isMine = msg.sender?.id === authUser?.id || 
                               (msg.sender?.email && msg.sender?.email === authUser?.email) || 
                               (msg.sender?.username && msg.sender?.username === authUser?.username);
                return (
                  <div key={msg.id} className={`${styles.messageBubble} ${isMine ? styles.sent : styles.received}`}>
                    {msg.message || msg.content}
                    <span className={styles.msgTime}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className={styles.chatInputArea}>
              <div className={styles.chatInputWrapper}>
                <input 
                  type="text" 
                  className={styles.chatInput} 
                  placeholder="Écrivez votre message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.sendBtn} disabled={!messageText.trim()}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#858796" }}>
             <i className="fas fa-comments" style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.2 }}></i>
             <h3>Sélectionnez une conversation</h3>
             <p>Discutez avec les administrateurs pour toute assistance.</p>
             <button onClick={openNewConversation} style={{ marginTop: "1rem", background: "#4e73df", color: "white", border: "none", padding: "0.75rem 2rem", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
               <i className="fas fa-plus" style={{ marginRight: "0.5rem" }}></i> Nouveau message
             </button>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConv && (
        <div className={styles.modalOverlay} onClick={() => setShowNewConv(false)}>
          <div className={styles.modal} style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Nouvelle Conversation</h3>
              <button className={styles.modalClose} onClick={() => setShowNewConv(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <input 
                  type="text" 
                  placeholder="Rechercher un membre..." 
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e3e6f0", outline: "none" }}
                />
              </div>
              <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filteredContacts.map((c) => (
                  <div key={c.id} onClick={() => startConversation(c)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", borderRadius: "12px", cursor: "pointer", border: "1px solid #e3e6f0", transition: "all 0.15s" }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fc"} 
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #4e73df, #224abe)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                      {c.firstName?.[0] || c.username?.[0] || "U"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.firstName || c.user?.firstName} {c.name || c.user?.name || ""}</div>
                      <div style={{ fontSize: "0.8rem", color: "#858796" }}>@{c.username || c.user?.email?.split('@')[0] || "membre"}</div>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && <div style={{ padding: "2rem", textAlign: "center", color: "#858796" }}>Aucun contact trouvé.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
