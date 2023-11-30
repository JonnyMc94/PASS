// React Imports
import React, { useState } from 'react';
// Material UI Imports
import Container from '@mui/material/Container';
import { NewMessageModal } from '@components/Modals';
import MessageButtonGroup from './MessageButtonGroup';

/**
 * Messages Page - Page that generates the components for the Message system
 * in PASS
 *
 * @memberof Pages
 * @name Messages
 * @param {React.JSX.Element} chilren - The wrapped Message Component
 * @returns {React.JSX.Element} The Messages Page
 */
const MessagesLayout = ({ children, path }) => {
  const [boxType, setBoxType] = useState(path === '/messages/inbox' ? 'inbox' : 'outbox');
  const [showModal, setShowModal] = useState(false);

  return (
    <Container sx={{ display: 'grid', gridTemplateRows: '80px 1fr' }}>
      <MessageButtonGroup setShowModal={setShowModal} boxType={boxType} setBoxType={setBoxType} />
      {children}
      {showModal && <NewMessageModal showModal={showModal} setShowModal={setShowModal} />}
    </Container>
  );
};

export default MessagesLayout;
