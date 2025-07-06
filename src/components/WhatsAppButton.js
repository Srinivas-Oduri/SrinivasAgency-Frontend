import React from 'react';
import './WhatsAppButton.css';

const whatsappNumber = '9959325457';

function WhatsAppButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="whatsapp-float" onClick={handleClick} title="Chat on WhatsApp">
      <i className="fab fa-whatsapp whatsapp-icon"></i>
    </div>
  );
}

export default WhatsAppButton;