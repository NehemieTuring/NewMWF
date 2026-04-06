"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./chat.module.css";
import { useTranslation } from "@/context/LanguageContext";
import { presidentService } from "@/services/presidentService";
import { useAuth } from "@/context/AuthContext";

export default function PresidentChat() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await presidentService.getConversations();
        setConversations(data || []);
        if (data && data.length > 0) setActiveConv(data[0]);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      async function loadMessages() {
        try {
          const data = await presidentService.getMessages(activeConv.id);
          setMessages(data || []);
        } catch (err) {
          console.error("Failed to load messages", err);
        }
      }
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Polling for president chat too
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !activeConv) return;
    try {
      await presidentService.sendMessage(activeConv.id, messageText);
      setMessageText("");
      const data = await presidentService.getMessages(activeConv.id);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="fas fa-spinner fa-spin"></div>
        <span>Messagerie présidentielle...</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.chatPage}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Messagerie</h2>
            <div className={styles.searchBar}>
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Rechercher des admins..." />
            </div>
          </div>
          <div className={styles.convList}>
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div 
                  key={conv.id} 
                  className={`${styles.convItem} ${activeConv?.id === conv.id ? styles.convItemActive : ""}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatar}>
                      {conv.otherPartyName?.[0] || conv.username?.[0] || "A"}
                    </div>
                    <div className={styles.onlineStatus}></div>
                  </div>
                  <div className={styles.convInfo}>
                    <span className={styles.convName}>{conv.otherPartyName}</span>
                    <p className={styles.lastMsg}>@{conv.username || "admin"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noActiveConv}>
                <div className={styles.noActiveIcon}>
                  <i className="fas fa-comment-dots"></i>
                </div>
                <p>Aucune discussion active.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.chatArea}>
          {activeConv ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.activeMember}>
                  <div className={styles.avatarSmall}>
                    {activeConv.otherPartyName?.[0] || "A"}
                  </div>
                  <div>
                    <h3>{activeConv.otherPartyName}</h3>
                    <div className={styles.statusText}>En ligne</div>
                  </div>
                </div>
              </div>

              <div className={styles.messagesList}>
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMine = msg.sender?.email === authUser?.email || msg.sender?.username === authUser?.username;
                    return (
                      <div key={msg.id} className={`${styles.messageWrapper} ${isMine ? styles.myMsgWrapper : ""}`}>
                        <div className={`${styles.message} ${isMine ? styles.myMsg : styles.otherMsg}`}>
                          <p>{msg.content}</p>
                          <span className={styles.msgTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noActiveConv}>
                    <div className={styles.noActiveIcon}>
                      <i className="fas fa-hand-sparkles"></i>
                    </div>
                    <p>Démarrez la conversation avec {activeConv.otherPartyName}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.chatFooter}>
                <div className={styles.inputContainer}>
                  <input 
                    type="text" 
                    placeholder="Écrivez votre message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                </div>
                <button 
                  className={styles.sendBtn} 
                  onClick={handleSend} 
                  disabled={!messageText.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noActiveConv}>
              <div className={styles.noActiveIcon}>
                <i className="fas fa-comments"></i>
              </div>
              <h2>Messagerie Présidentielle</h2>
              <p>Sélectionnez un administrateur pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
