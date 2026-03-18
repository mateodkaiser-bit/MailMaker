import BlockEditor from './BlockEditor.jsx';

export default function EditorCanvas({ theme }) {
  return (
    <div
      className="dot-grid"
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 24px',
      }}
    >
      {/* Paper canvas */}
      <div
        style={{
          width: '100%',
          maxWidth: `${theme?.maxWidth ?? 680}px`,
          background: theme?.backgroundColor ?? '#ffffff',
          border: '1px solid #000',
          borderRadius: 0,
          boxShadow: 'none',
          minHeight: 400,
          position: 'relative',
          overflow: 'hidden',
          padding: '32px 56px',
          fontFamily: theme?.fontFamily ?? 'var(--font-sans)',
          fontSize: `${theme?.bodyFontSize ?? 16}px`,
        }}
      >
        <BlockEditor theme={theme} />
      </div>
    </div>
  );
}
