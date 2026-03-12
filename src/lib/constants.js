export function getDefaultTheme() {
  return {
    maxWidth: 680,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    bodyFontSize: 16,
    linkColor: '#D97706',
  };
}

export const BLOCK_TYPES = {
  PARAGRAPH:      'paragraph',
  HEADING:        'heading',
  BLOCK_IMAGE:    'blockImage',
  BLOCK_BUTTON:   'blockButton',
  BLOCK_DIVIDER:  'blockDivider',
  BLOCK_SPACER:   'blockSpacer',
  BLOCK_COLUMNS:  'blockColumns',
  BLOCK_SOCIAL:   'blockSocialIcons',
  SHARED_INSTANCE:'sharedInstance',
};

export const STARTER_NEWSLETTER = {
  type: 'doc',
  content: [
    { type: 'blockImage', attrs: { src: '', alt: 'Your logo', width: 120, align: 'left' } },
    { type: 'blockSpacer', attrs: { height: 32 } },
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Your newsletter title' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Hi {{ first_name }},' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Write your intro here. Keep it short — two or three sentences that give the reader a reason to keep going.' }] },
    { type: 'blockDivider', attrs: { color: '#E5E7EB', thickness: 1 } },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Section heading' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Your content here.' }] },
    { type: 'blockButton', attrs: { label: 'Read more', href: '#', backgroundColor: '#D97706' } },
    { type: 'blockSpacer', attrs: { height: 40 } },
    { type: 'paragraph', attrs: { textAlign: 'center' }, content: [{ type: 'text', text: 'Unsubscribe · View in browser' }] },
  ],
};

export const STARTER_WELCOME = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome, {{ first_name }}.' }] },
    { type: 'paragraph', content: [{ type: 'text', text: "You're in. Here's what to expect." }] },
    { type: 'blockDivider', attrs: {} },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Get started in 3 steps' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '1. Do this first' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '2. Then this' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '3. Then this' }] },
    { type: 'blockButton', attrs: { label: 'Get started →', href: '#' } },
  ],
};

export const STARTER_ANNOUNCEMENT = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Announcing: [thing]' }] },
    { type: 'paragraph', content: [{ type: 'text', text: "Today we're launching something we've been building for a while." }] },
    { type: 'blockImage', attrs: { src: '', alt: 'Product screenshot', width: '100%' } },
    { type: 'paragraph', content: [{ type: 'text', text: 'More context about why this matters.' }] },
    { type: 'blockButton', attrs: { label: 'See it now', href: '#' } },
  ],
};

export const STARTER_PLAIN = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Hi {{ first_name }},' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Write your email here. Plain and simple.' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '— Your name' }] },
  ],
};

export const STARTER_TEMPLATES = [
  { label: 'Newsletter', doc: STARTER_NEWSLETTER },
  { label: 'Welcome email', doc: STARTER_WELCOME },
  { label: 'Announcement', doc: STARTER_ANNOUNCEMENT },
  { label: 'Plain text digest', doc: STARTER_PLAIN },
];
