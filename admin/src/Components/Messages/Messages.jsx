import React, { useEffect, useState } from 'react';
import './Messages.css';
import mark from '../../assets/mark.png';
import marked from '../../assets/marked.png';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(
    // Load initial selection from localStorage if available
    new Set(JSON.parse(localStorage.getItem('selectedMessages') || '[]'))
  );

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/messages');
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
      } else {
        alert('Error fetching messages');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching messages');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkClick = (messageId) => {
    const newSelectedMessages = new Set(selectedMessages);
    if (newSelectedMessages.has(messageId)) {
      newSelectedMessages.delete(messageId); // Deselect
    } else {
      newSelectedMessages.add(messageId); // Select
    }
    setSelectedMessages(newSelectedMessages);

    // Update localStorage with the new selection state
    localStorage.setItem('selectedMessages', JSON.stringify(Array.from(newSelectedMessages))); // Convert Set to array for localStorage
  };

  useEffect(() => {
    // Update localStorage whenever selectedMessages state changes
    localStorage.setItem('selectedMessages', JSON.stringify(Array.from(selectedMessages)));
  }, [selectedMessages]); // Dependency on selectedMessages

  return (
    <div className="messages">
      <div className="message-list">
        {messages.map((message) => (
          <div className="message" key={message._id}>
            <p><strong>Username:</strong> {message.name}</p>
            <p><strong>Message:</strong> {message.message}</p>
            <img
              src={selectedMessages.has(message._id) ? marked : mark}
              alt="Mark/Unmark message"
              onClick={() => handleMarkClick(message._id)}
              style={{ cursor: 'pointer' }} // Add cursor for visual feedback
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
