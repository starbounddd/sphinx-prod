import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Buttons
import { PrimaryButton, SecondaryButton, TertiaryButton, GhostButton } from "@/shared/ui/buttons";
import { ShimmerButton, BorderBeam, WordFadeIn } from "@/shared/ui/magicui";

// Typography
import { Typography } from "@/shared/ui/typography";

// Chat
import { ChatInput, ChatMessage, QuickReplyChip } from "@/shared/ui/chat";

// Navigation
import { Navbar, Footer } from "@/shared/ui/navigation";

const meta: Meta = {
  title: "Design System/Shared Components States",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

// ============================================
// SECTION WRAPPER
// ============================================
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 border-b border-sage pb-2 text-xl font-semibold text-dark">{title}</h2>
      {children}
    </section>
  );
}

function StateRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium text-gray">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

// ============================================
// MAIN STORY
// ============================================
export const AllSharedStates: Story = {
  render: () => (
    <div className="min-h-screen bg-cream p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 border-b-4 border-coral pb-8">
          <h1 className="text-4xl font-bold text-dark">Shared Components</h1>
          <p className="mt-2 text-lg text-gray">All states and variants</p>
        </div>

        {/* ============================================ */}
        {/* BUTTONS */}
        {/* ============================================ */}
        <Section title="Buttons">
          {/* Primary Button */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Primary Button</h3>
            <StateRow label="Default">
              <PrimaryButton>Primary</PrimaryButton>
            </StateRow>
            <StateRow label="With Arrow">
              <PrimaryButton showArrow>Get Started</PrimaryButton>
            </StateRow>
            <StateRow label="Shimmer">
              <PrimaryButton shimmer>Shimmer Effect</PrimaryButton>
            </StateRow>
            <StateRow label="Full Width">
              <div className="w-64">
                <PrimaryButton fullWidth>Full Width</PrimaryButton>
              </div>
            </StateRow>
            <StateRow label="Disabled">
              <PrimaryButton disabled>Disabled</PrimaryButton>
            </StateRow>
            <StateRow label="Small">
              <PrimaryButton className="px-4 py-2 text-sm">Small</PrimaryButton>
            </StateRow>
          </div>

          {/* Secondary Button */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Secondary Button</h3>
            <StateRow label="Default">
              <SecondaryButton>Secondary</SecondaryButton>
            </StateRow>
            <StateRow label="Full Width">
              <div className="w-64">
                <SecondaryButton fullWidth>Full Width</SecondaryButton>
              </div>
            </StateRow>
            <StateRow label="Disabled">
              <SecondaryButton disabled>Disabled</SecondaryButton>
            </StateRow>
            <StateRow label="Small">
              <SecondaryButton className="px-6 py-3 text-sm">Small</SecondaryButton>
            </StateRow>
          </div>

          {/* Tertiary Button */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Tertiary Button</h3>
            <StateRow label="Default">
              <TertiaryButton>Tertiary</TertiaryButton>
            </StateRow>
            <StateRow label="Full Width">
              <div className="w-64">
                <TertiaryButton fullWidth>Full Width</TertiaryButton>
              </div>
            </StateRow>
            <StateRow label="Disabled">
              <TertiaryButton disabled>Disabled</TertiaryButton>
            </StateRow>
            <StateRow label="Small">
              <TertiaryButton className="px-6 py-3 text-sm">Small</TertiaryButton>
            </StateRow>
          </div>

          {/* Ghost Button */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Ghost Button</h3>
            <StateRow label="Default">
              <GhostButton>Ghost</GhostButton>
            </StateRow>
            <StateRow label="Full Width">
              <div className="w-64">
                <GhostButton fullWidth>Full Width</GhostButton>
              </div>
            </StateRow>
            <StateRow label="Disabled">
              <GhostButton disabled>Disabled</GhostButton>
            </StateRow>
            <StateRow label="Small">
              <GhostButton className="px-6 py-3 text-sm">Small</GhostButton>
            </StateRow>
          </div>

          {/* Shimmer Button */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Shimmer Button</h3>
            <StateRow label="Default">
              <ShimmerButton>Shimmer</ShimmerButton>
            </StateRow>
            <StateRow label="Custom Color">
              <ShimmerButton background="#10b981">Custom BG</ShimmerButton>
            </StateRow>
            <StateRow label="Disabled">
              <ShimmerButton disabled>Disabled</ShimmerButton>
            </StateRow>
          </div>
        </Section>

        {/* ============================================ */}
        {/* TYPOGRAPHY */}
        {/* ============================================ */}
        <Section title="Typography">
          {/* Sizes */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Type Scale (Outfit)</h3>
            <div className="space-y-4">
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">H1 / 96px</span>
                <Typography size="h1">H1</Typography>
              </div>
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">H2 / 60px</span>
                <Typography size="h2">Heading 2</Typography>
              </div>
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">H3 / 36px</span>
                <Typography size="h3">Heading 3</Typography>
              </div>
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">H4 / 24px</span>
                <Typography size="h4">Heading 4</Typography>
              </div>
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">body / 18px</span>
                <Typography size="body">Body text for content</Typography>
              </div>
              <div className="flex items-baseline gap-4 border-b border-sage/30 pb-3">
                <span className="w-24 text-xs text-gray">body-sm / 14px</span>
                <Typography size="body-sm">Small body text</Typography>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="w-24 text-xs text-gray">caption / 12px</span>
                <Typography size="caption">Caption text</Typography>
              </div>
            </div>
          </div>

          {/* Font Families */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Font Families</h3>
            <StateRow label="Sans (Outfit)">
              <Typography font="text" size="h4">The quick brown fox</Typography>
            </StateRow>
            <StateRow label="Chat (Inter)">
              <Typography font="chat" size="h4">The quick brown fox</Typography>
            </StateRow>
            <StateRow label="Handwritten">
              <Typography font="handwritten" size="h4">The quick brown fox</Typography>
            </StateRow>
          </div>

          {/* Colors */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Text Colors</h3>
            <StateRow label="Default">
              <Typography color="default" size="body">Default text color</Typography>
            </StateRow>
            <StateRow label="Muted">
              <Typography color="muted" size="body">Muted text color</Typography>
            </StateRow>
            <StateRow label="Coral">
              <Typography color="coral" size="body">Coral accent color</Typography>
            </StateRow>
          </div>
        </Section>

        {/* ============================================ */}
        {/* CHAT COMPONENTS */}
        {/* ============================================ */}
        <Section title="Chat Components">
          {/* Chat Messages */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Chat Message</h3>
            <StateRow label="AI Message">
              <ChatMessage variant="ai">Hello! How can I help you today?</ChatMessage>
            </StateRow>
            <StateRow label="User Message">
              <ChatMessage variant="user">I have a question about my account.</ChatMessage>
            </StateRow>
            <StateRow label="AI Long">
              <div className="max-w-md">
                <ChatMessage variant="ai">
                  This is a longer message that demonstrates how the chat bubble handles multiple lines of text.
                  It should wrap nicely within the container.
                </ChatMessage>
              </div>
            </StateRow>
            <StateRow label="User Long">
              <div className="max-w-md">
                <ChatMessage variant="user">
                  I&apos;ve been feeling overwhelmed lately. Work has been really stressful and I&apos;m not sleeping well.
                </ChatMessage>
              </div>
            </StateRow>
          </div>

          {/* Quick Reply Chips */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Quick Reply Chip</h3>
            <StateRow label="Default">
              <QuickReplyChip onClick={() => {}}>Option 1</QuickReplyChip>
              <QuickReplyChip onClick={() => {}}>Option 2</QuickReplyChip>
            </StateRow>
            <StateRow label="Selected">
              <QuickReplyChip onClick={() => {}} selected>Selected</QuickReplyChip>
            </StateRow>
            <StateRow label="Disabled">
              <QuickReplyChip onClick={() => {}} disabled>Disabled</QuickReplyChip>
            </StateRow>
            <StateRow label="Group">
              <div className="flex flex-wrap gap-2">
                <QuickReplyChip onClick={() => {}}>Anxious</QuickReplyChip>
                <QuickReplyChip onClick={() => {}} selected>Stressed</QuickReplyChip>
                <QuickReplyChip onClick={() => {}}>Tired</QuickReplyChip>
                <QuickReplyChip onClick={() => {}}>Overwhelmed</QuickReplyChip>
              </div>
            </StateRow>
          </div>

          {/* Chat Input */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Chat Input</h3>
            <StateRow label="Empty">
              <div className="w-96">
                <ChatInput value="" onChange={() => {}} onSend={() => {}} placeholder="Type a message..." />
              </div>
            </StateRow>
            <StateRow label="With Text">
              <div className="w-96">
                <ChatInput value="Hello, I need help with..." onChange={() => {}} onSend={() => {}} />
              </div>
            </StateRow>
            <StateRow label="Disabled">
              <div className="w-96">
                <ChatInput value="" onChange={() => {}} onSend={() => {}} disabled placeholder="Disabled..." />
              </div>
            </StateRow>
          </div>
        </Section>

        {/* ============================================ */}
        {/* MAGIC UI EFFECTS */}
        {/* ============================================ */}
        <Section title="Magic UI Effects">
          <div className="rounded-2xl bg-white p-6">
            {/* Border Beam */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-dark">Border Beam</h3>
              <div className="flex gap-6">
                <div className="relative h-32 w-48 overflow-hidden rounded-xl bg-sage">
                  <BorderBeam size={80} duration={4} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-dark">Default</span>
                </div>
                <div className="relative h-32 w-48 overflow-hidden rounded-xl bg-lavender">
                  <BorderBeam size={60} duration={2} colorFrom="#ffb7b2" colorTo="#ff9b95" />
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-dark">Coral</span>
                </div>
              </div>
            </div>

            {/* Word Fade In */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-dark">Word Fade In</h3>
              <div className="space-y-4">
                <div>
                  <span className="mr-4 text-sm text-gray">Default:</span>
                  <WordFadeIn words="Words fade in one by one" />
                </div>
                <div>
                  <span className="mr-4 text-sm text-gray">Slow:</span>
                  <WordFadeIn words="Slower animation effect" delay={0.2} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================ */}
        {/* NAVIGATION */}
        {/* ============================================ */}
        <Section title="Navigation">
          {/* Navbar */}
          <div className="mb-8 rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Navbar</h3>
            <div className="overflow-hidden rounded-xl border [&_header]:static [&_header]:pt-4">
              <Navbar />
              <div className="h-16 bg-cream" />
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-dark">Footer</h3>
            <div className="overflow-hidden rounded-xl border">
              <Footer />
            </div>
          </div>
        </Section>

        {/* ============================================ */}
        {/* BUTTON SIZE COMPARISON */}
        {/* ============================================ */}
        <Section title="Button Size Comparison">
          <div className="rounded-2xl bg-white p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="text-center">
                <PrimaryButton className="px-4 py-2 text-sm">Small</PrimaryButton>
                <p className="mt-2 text-xs text-gray">Small</p>
              </div>
              <div className="text-center">
                <PrimaryButton>Default</PrimaryButton>
                <p className="mt-2 text-xs text-gray">Default</p>
              </div>
              <div className="text-center">
                <PrimaryButton className="px-12 py-4 text-xl">Large</PrimaryButton>
                <p className="mt-2 text-xs text-gray">Large</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================ */}
        {/* ALL BUTTON VARIANTS (Side by Side) */}
        {/* ============================================ */}
        <Section title="All Button Variants">
          <div className="rounded-2xl bg-white p-6">
            <div className="flex flex-wrap gap-4">
              <PrimaryButton>Primary</PrimaryButton>
              <SecondaryButton>Secondary</SecondaryButton>
              <TertiaryButton>Tertiary</TertiaryButton>
              <GhostButton>Ghost</GhostButton>
              <ShimmerButton>Shimmer</ShimmerButton>
            </div>
          </div>
        </Section>
      </div>
    </div>
  ),
};
