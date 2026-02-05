import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Shared/Typography',
  component: Typography,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    font: { control: 'select', options: ['text', 'chat', 'handwritten'] },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'body-sm', 'caption'],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'coral', 'inherit'],
    },
    align: { control: 'select', options: ['left', 'center', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ============================================
// SIZE VARIANTS (All sizes using text font)
// ============================================

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="space-y-4">
      <Typography size="h1">H1 - 96px Bold</Typography>
      <Typography size="h2">H2 - 60px Bold</Typography>
      <Typography size="h3">H3 - 36px Bold</Typography>
      <Typography size="h4">H4 - 24px Bold</Typography>
      <Typography size="body">Body - 18px Normal</Typography>
      <Typography size="body-sm">Body Small - 14px Normal</Typography>
      <Typography size="caption">Caption - 12px Normal</Typography>
    </div>
  ),
};

export const SizeH1: Story = {
  name: 'Size: H1 (96px)',
  args: { size: 'h1', children: 'The quick brown fox' },
};
export const SizeH2: Story = {
  name: 'Size: H2 (60px)',
  args: { size: 'h2', children: 'The quick brown fox' },
};
export const SizeH3: Story = {
  name: 'Size: H3 (36px)',
  args: { size: 'h3', children: 'The quick brown fox' },
};
export const SizeH4: Story = {
  name: 'Size: H4 (24px)',
  args: { size: 'h4', children: 'The quick brown fox' },
};
export const SizeBody: Story = {
  name: 'Size: Body (18px)',
  args: {
    size: 'body',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};
export const SizeBodySm: Story = {
  name: 'Size: Body Small (14px)',
  args: {
    size: 'body-sm',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};
export const SizeCaption: Story = {
  name: 'Size: Caption (12px)',
  args: {
    size: 'caption',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};

// ============================================
// FONT VARIANTS
// ============================================

export const AllFonts: Story = {
  name: 'All Fonts',
  render: () => (
    <div className="space-y-8">
      <div>
        <Typography
          size="caption"
          color="muted"
          className="mb-2 uppercase tracking-wider"
        >
          Text Font — Outfit
        </Typography>
        <Typography size="h3">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography size="body">
          The quick brown fox jumps over the lazy dog. 0123456789
        </Typography>
      </div>
      <div>
        <Typography
          size="caption"
          color="muted"
          className="mb-2 uppercase tracking-wider"
        >
          Chat Font — Inter
        </Typography>
        <Typography font="chat" size="h3">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography font="chat" size="body">
          The quick brown fox jumps over the lazy dog. 0123456789
        </Typography>
      </div>
      <div>
        <Typography
          size="caption"
          color="muted"
          className="mb-2 uppercase tracking-wider"
        >
          Handwritten Font — Reenie Beanie
        </Typography>
        <Typography font="handwritten" size="h3">
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography font="handwritten" size="body">
          "The quick brown fox jumps over the lazy dog"
        </Typography>
      </div>
    </div>
  ),
};

export const FontText: Story = {
  name: 'Font: Text (Outfit)',
  render: () => (
    <div className="space-y-2">
      <Typography font="text" size="h1">
        H1 Text
      </Typography>
      <Typography font="text" size="h2">
        H2 Text
      </Typography>
      <Typography font="text" size="h3">
        H3 Text
      </Typography>
      <Typography font="text" size="h4">
        H4 Text
      </Typography>
      <Typography font="text" size="body">
        Body Text
      </Typography>
      <Typography font="text" size="body-sm">
        Body Small Text
      </Typography>
      <Typography font="text" size="caption">
        Caption Text
      </Typography>
    </div>
  ),
};

export const FontChat: Story = {
  name: 'Font: Chat (Inter)',
  render: () => (
    <div className="space-y-2">
      <Typography font="chat" size="h1">
        H1 Chat
      </Typography>
      <Typography font="chat" size="h2">
        H2 Chat
      </Typography>
      <Typography font="chat" size="h3">
        H3 Chat
      </Typography>
      <Typography font="chat" size="h4">
        H4 Chat
      </Typography>
      <Typography font="chat" size="body">
        Body Chat
      </Typography>
      <Typography font="chat" size="body-sm">
        Body Small Chat
      </Typography>
      <Typography font="chat" size="caption">
        Caption Chat
      </Typography>
    </div>
  ),
};

export const FontHandwritten: Story = {
  name: 'Font: Handwritten (Reenie Beanie)',
  render: () => (
    <div className="space-y-2">
      <Typography font="handwritten" size="h1">
        "H1 Handwritten"
      </Typography>
      <Typography font="handwritten" size="h2">
        "H2 Handwritten"
      </Typography>
      <Typography font="handwritten" size="h3">
        "H3 Handwritten"
      </Typography>
      <Typography font="handwritten" size="h4">
        "H4 Handwritten"
      </Typography>
      <Typography font="handwritten" size="body">
        "Body Handwritten"
      </Typography>
      <Typography font="handwritten" size="body-sm">
        "Body Small Handwritten"
      </Typography>
      <Typography font="handwritten" size="caption">
        "Caption Handwritten"
      </Typography>
    </div>
  ),
};

// ============================================
// COLOR VARIANTS
// ============================================

export const AllColors: Story = {
  name: 'All Colors',
  render: () => (
    <div className="space-y-2">
      <Typography size="h4" color="default">
        Default Color (text-foreground)
      </Typography>
      <Typography size="h4" color="muted">
        Muted Color (text-muted-foreground)
      </Typography>
      <Typography size="h4" color="coral">
        Coral Color (text-coral)
      </Typography>
      <Typography size="h4" color="inherit">
        Inherit Color (text-inherit)
      </Typography>
    </div>
  ),
};

// ============================================
// ALIGNMENT
// ============================================

export const Alignment: Story = {
  name: 'Alignment',
  render: () => (
    <div className="space-y-4 border border-dashed border-gray-300 p-4">
      <Typography size="body" align="left">
        Left aligned text
      </Typography>
      <Typography size="body" align="center">
        Center aligned text
      </Typography>
      <Typography size="body" align="right">
        Right aligned text
      </Typography>
    </div>
  ),
};

// ============================================
// COMPLETE MATRIX (Font x Size)
// ============================================

export const CompleteMatrix: Story = {
  name: 'Complete Matrix',
  render: () => (
    <div className="space-y-12">
      {(['text', 'chat', 'handwritten'] as const).map((font) => (
        <div key={font}>
          <Typography
            size="caption"
            color="coral"
            className="mb-4 uppercase tracking-wider"
          >
            {font} font
          </Typography>
          <div className="space-y-1">
            {(
              ['h1', 'h2', 'h3', 'h4', 'body', 'body-sm', 'caption'] as const
            ).map((size) => (
              <Typography key={size} font={font} size={size}>
                {size}: The quick brown fox
              </Typography>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
