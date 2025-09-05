import React, { useState } from 'react';
import RefactoredFloatingAITutor from '@/components/RefactoredFloatingAITutor';

const btnStyle: React.CSSProperties = {
  position: 'fixed',
  right: '20px',
  bottom: '20px',
  width: 64,
  height: 64,
  borderRadius: '9999px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  border: 'none',
  cursor: 'pointer',
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0
};

const avatarStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '9999px',
  objectFit: 'cover'
};

const sheetBackdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const sheetStyle: React.CSSProperties = {
  width: 'min(960px, 96vw)',
  height: 'min(700px, 92vh)',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
  overflow: 'hidden',
  position: 'relative'
};

const closeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'transparent',
  border: 'none',
  fontSize: 18,
  cursor: 'pointer'
};

export default function NELIELauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open NELIE"
        style={btnStyle}
        onClick={() => setOpen(true)}
      >
        <img src="/nelie.png" alt="NELIE" style={avatarStyle} />
      </button>

      {/* Modal sheet with tutor */}
      {open && (
        <div style={sheetBackdrop} onClick={() => setOpen(false)}>
          <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
            <button style={closeStyle} onClick={() => setOpen(false)} aria-label="Close">✕</button>
            {/* Her bruger vi den nyeste tutor-variant */}
            <RefactoredFloatingAITutor />
          </div>
        </div>
      )}
    </>
  );
}
