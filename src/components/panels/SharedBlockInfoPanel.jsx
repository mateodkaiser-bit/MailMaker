import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedBlockStore } from '../../store/sharedBlocks.js';
import { detachSharedBlock } from '../../lib/detachSharedBlock.js';
import { useToast } from '../ui/Toast.jsx';
import Icon from '../ui/Icon.jsx';

export default function SharedBlockInfoPanel({ editor }) {
  const navigate = useNavigate();
  const { getBlock, blocks } = useSharedBlockStore();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!editor) return null;
  if (!editor.isActive('sharedInstance')) return null;

  const attrs = editor.getAttributes('sharedInstance');
  const block = getBlock(attrs.sharedBlockId);
  const hasSnapshot = !!attrs.snapshot;
  const canDetach = !!(block || hasSnapshot);

  function handleDetachClick() { setConfirmOpen(true); }

  function handleConfirm() {
    setConfirmOpen(false);
    const ok = detachSharedBlock(editor, blocks);
    if (ok) toast('Block detached — content is now editable', 'success');
    else    toast('Could not detach block', 'danger');
  }

  function handleCancel() { setConfirmOpen(false); }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-slate)' }}>
          SHARED BLOCK
        </h3>

        <div style={{
          background: 'var(--color-accent-soft)',
          border: '1px solid var(--color-accent-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
            {block?.name ?? attrs.label ?? 'Shared Block'}
          </div>
        </div>

        {!block && (
          <div style={{
            background: 'var(--color-danger-bg)', color: 'var(--color-danger)',
            borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 'var(--text-xs)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="warning" size={14} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            Original block deleted — snapshot is being used
          </div>
        )}

        <button
          onClick={() => navigate('/blocks')}
          style={{
            padding: '8px 14px',
            background: 'transparent', color: 'var(--color-accent)',
            border: '1px solid var(--color-accent)', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Icon name="open_in_new" size={15} style={{ color: 'inherit' }} />
          Edit in Blocks
        </button>

        <button
          onClick={handleDetachClick}
          disabled={!canDetach}
          title={!canDetach ? 'No source content available to detach' : 'Replace this reference with an editable copy of the block content'}
          style={{
            padding: '8px 14px',
            background: canDetach ? 'var(--color-ghost)' : 'transparent',
            color: canDetach ? 'var(--color-slate)' : 'var(--color-muted)',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
            fontWeight: 600, fontSize: 'var(--text-sm)',
            cursor: canDetach ? 'pointer' : 'default',
            opacity: canDetach ? 1 : 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Icon name="content_cut" size={15} style={{ color: 'inherit' }} />
          Detach Block
        </button>
      </div>

      {confirmOpen && (
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              padding: 24,
              maxWidth: 400, width: '90%',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-ink)' }}>
              Detach shared block?
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-slate)', lineHeight: 1.5 }}>
              {block
                ? 'This will replace the shared block reference with an editable copy of its current content. Future changes to the original block will no longer affect this template.'
                : 'The original shared block has been deleted. This will replace the reference with an editable copy of the saved snapshot.'}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-ghost)', color: 'var(--color-slate)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-accent)', color: 'var(--color-white)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                }}
              >
                Detach
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
