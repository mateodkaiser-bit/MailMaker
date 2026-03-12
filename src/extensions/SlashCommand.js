import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const SLASH_MENU_KEY = new PluginKey('slashMenu');

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SLASH_MENU_KEY,
        state: {
          init() {
            return { active: false, query: '', range: null };
          },
          apply(tr, prev) {
            const meta = tr.getMeta(SLASH_MENU_KEY);
            if (meta !== undefined) return meta;
            return prev;
          },
        },
        view(editorView) {
          return {
            update(view, prevState) {
              const { state } = view;
              const { selection } = state;
              const { $from } = selection;
              const textBefore = $from.parent.textBetween(
                Math.max(0, $from.parentOffset - 50),
                $from.parentOffset,
                undefined,
                '\ufffc'
              );
              const slashMatch = textBefore.match(/\/(\w*)$/);

              if (slashMatch) {
                const query = slashMatch[1];
                const from = selection.from - slashMatch[0].length;
                const to = selection.from;
                view.dispatch(
                  view.state.tr.setMeta(SLASH_MENU_KEY, {
                    active: true,
                    query,
                    range: { from, to },
                  })
                );
              } else {
                const pluginState = SLASH_MENU_KEY.getState(state);
                if (pluginState?.active) {
                  view.dispatch(
                    view.state.tr.setMeta(SLASH_MENU_KEY, {
                      active: false,
                      query: '',
                      range: null,
                    })
                  );
                }
              }
            },
          };
        },
      }),
    ];
  },
});
