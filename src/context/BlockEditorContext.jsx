import { createContext, useContext } from 'react';

const BlockEditorContext = createContext(null);

export function BlockEditorProvider({ value, children }) {
  return (
    <BlockEditorContext.Provider value={value}>
      {children}
    </BlockEditorContext.Provider>
  );
}

export function useBlockEditorContext() {
  const ctx = useContext(BlockEditorContext);
  if (!ctx) throw new Error('useBlockEditorContext must be used inside BlockEditorProvider');
  return ctx;
}
