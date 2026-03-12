import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { BlockImage } from '../extensions/BlockImage.js';
import { BlockButton } from '../extensions/BlockButton.js';
import { BlockDivider } from '../extensions/BlockDivider.js';
import { BlockSpacer } from '../extensions/BlockSpacer.js';
import { BlockColumns } from '../extensions/BlockColumns.js';
import { BlockSocialIcons } from '../extensions/BlockSocialIcons.js';
import { BlockSharedInstance } from '../extensions/BlockSharedInstance.js';
import { SlashCommand } from '../extensions/SlashCommand.js';

export function useEditor({ content, onUpdate, placeholder = 'Type / to insert a block…' }) {
  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder }),
      Typography,
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FontFamily,
      BlockImage,
      BlockButton,
      BlockDivider,
      BlockSpacer,
      BlockColumns,
      BlockSocialIcons,
      BlockSharedInstance,
      SlashCommand,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
  });

  return editor;
}
