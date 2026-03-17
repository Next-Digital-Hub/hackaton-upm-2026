import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';
import './MarkdownContent.css';
import MarkdownContent from './MarkdownContent';

const ChatAssistant = ({ token, userName, roles = [], userProfile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ id: null, loading: false });
  const [systemPrompt, setSystemPrompt] = useState('');
  const messagesEndRef = useRef(null);

  const isAdmin = roles.includes('admin');

  // Endpoint de la API via Proxy
  const PROMPT_API_URL = '/ai-api/prompt';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchSystemPrompt = async () => {
      try {
        const response = await fetch('/backend/user-profile/system-prompt', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSystemPrompt(data.systemPrompt);
        }
      } catch (error) {
        console.error('Error fetching system prompt:', error);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await fetch('/backend/chat-log/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const history = await response.json();
          const mappedHistory = history.map(h => ({
            id: h.id,
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.message,
            timestamp: h.timestamp
          }));
          setMessages(mappedHistory);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (token) {
      fetchSystemPrompt();
      fetchHistory();
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessageContent
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await saveChatToDatabase(userMessageContent, 'user');

      const response = await fetch(PROMPT_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCaXRTaXN0ZXJzIiwiZXhwIjoxNzczODIzMTY1fQ.iNdUJ883uC-YTheu0wP5RS9QFlnfzQLmY-qO2NQHgYA`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system_prompt: systemPrompt || `Eres un asistente experto en meteorología y emergencias climáticas para el usuario ${userName}.`,
          user_prompt: userMessageContent
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener respuesta del asistente.`);
      }

      const data = await response.json();
      const assistantContent = data.response || data.content || "Lo siento, no he podido procesar tu solicitud.";

      const assistantReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantContent
      };

      setMessages(prev => [...prev, assistantReply]);
      await saveChatToDatabase(assistantContent, 'assistant');

    } catch (error) {
      console.error("Error calling AI Assistant:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Lo siento, ha ocurrido un error al conectar con el servicio inteligente. Por favor, inténtalo de nuevo más tarde.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatToDatabase = async (text, sender) => {
    try {
      await fetch('/backend/chat-log/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          sender: sender
        })
      });
    } catch (err) {
      console.error('Error al persistir chat:', err);
    }
  };

  const convertToAlert = async (msgId, content) => {
    setAlertStatus({ id: msgId, loading: true });
    try {
      const alertData = {
        type: content.length > 20 ? content.substring(0, 20) + '...' : content,
        severity: 'Naranja',
        description: content,
        location: userProfile?.province || 'Madrid',
      };

      const response = await fetch('/backend/alertas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        alert('alerta creada con éxito ✅');
      } else {
        alert('Error al crear la alerta. Verifica tus permisos de administrador.');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Error de conexión al crear la alerta.');
    } finally {
      setAlertStatus({ id: null, loading: false });
    }
  };

  return (
    <div className="assistant-container">
      <div className="chat-window">
        <div className="messages-container">
          {messages.length === 0 && !isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble">
                <div className="message-header">🤖 EmerCLI Expert</div>
                <div className="message-content">
                  <MarkdownContent content={`Hola ${userName}, soy tu asistente experto en meteorología y emergencias climáticas. ¿En qué puedo ayudarte hoy?`} />
                </div>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`}>
              <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                <div className="message-header">
                  {msg.role === 'assistant' ? '🤖 EmerCLI Expert' : `👤 ${userName}`}
                </div>
                <div className="message-content">
                  {msg.role === 'assistant' ? (
                    <MarkdownContent content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                {isAdmin && msg.role === 'assistant' && !msg.isError && (
                  <button
                    className={`create-alert-btn ${alertStatus.id === msg.id ? 'loading' : ''}`}
                    onClick={() => convertToAlert(msg.id, msg.content)}
                    disabled={alertStatus.loading}
                  >
                    {alertStatus.id === msg.id ? '🕒 Creando...' : '🚩 Generar Alerta'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-area-wrapper">
        <form className="input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Haz una pregunta sobre meteorología..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>

      <div className="bg-shape shape-assistant-1"></div>
      <div className="bg-shape shape-assistant-2"></div>
    </div>
  );
};

export default ChatAssistant;
