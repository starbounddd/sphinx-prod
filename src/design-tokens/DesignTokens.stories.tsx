import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import tokens from "./tokens.json";

const meta: Meta = {
  title: "Design System/Tokens",
  parameters: {
    layout: "padded",
  },
};

export default meta;

// ============================================
// COLOR PALETTE
// ============================================

// Semantic color mapping to actual hex values
const SEMANTIC_COLORS = {
  background: { value: "#fdfcf8", description: "Page background" },
  foreground: { value: "#292524", description: "Main text color" },
  primary: { value: "#000000", description: "Primary actions" },
  secondary: { value: "#d4e4d4", description: "Secondary elements" },
  accent: { value: "#ffb7b2", description: "Accent/highlight" },
  muted: { value: "#efedf4", description: "Muted backgrounds" },
  destructive: { value: "#dc2626", description: "Error/danger" },
  border: { value: "#d4e4d4", description: "Borders" },
  ring: { value: "#ffb7b2", description: "Focus rings" },
};

function ColorSwatch({ name, value, description }: { name: string; value: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-20 w-20 rounded-xl border border-sage shadow-sm"
        style={{ backgroundColor: value }}
      />
      <span className="text-sm font-medium text-dark">{name}</span>
      <span className="font-mono text-xs text-gray">{value}</span>
      {description && <span className="text-center text-xs text-gray/70">{description}</span>}
    </div>
  );
}

function ColorPalette() {
  const primitives = tokens.colors.primitives;

  return (
    <div className="space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Color Palette</h1>
        <p className="text-gray">All colors used in the Sphinx design system</p>
      </div>

      {/* Brand Colors */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Brand Colors</h2>
        <div className="grid grid-cols-3 gap-6 md:grid-cols-5">
          <ColorSwatch name="Cream" value="#fdfcf8" description="Background" />
          <ColorSwatch name="Dark" value="#292524" description="Text" />
          <ColorSwatch name="Sage" value="#d4e4d4" description="Secondary" />
          <ColorSwatch name="Coral" value="#ffb7b2" description="Accent" />
          <ColorSwatch name="Lavender" value="#efedf4" description="Muted" />
        </div>
      </section>

      {/* Primitive Colors */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Primitive Colors</h2>
        <div className="grid grid-cols-4 gap-6 md:grid-cols-6">
          {Object.entries(primitives).map(([name, { value }]) => (
            <ColorSwatch key={name} name={name} value={value} />
          ))}
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Semantic Colors</h2>
        <div className="grid grid-cols-3 gap-6 md:grid-cols-5">
          {Object.entries(SEMANTIC_COLORS).map(([name, { value, description }]) => (
            <ColorSwatch key={name} name={name} value={value} description={description} />
          ))}
        </div>
      </section>

      {/* Status Colors */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Status Colors</h2>
        <div className="grid grid-cols-4 gap-6">
          <ColorSwatch name="Success" value="#10b981" description="Emerald" />
          <ColorSwatch name="Warning" value="#d97706" description="Amber" />
          <ColorSwatch name="Error" value="#dc2626" description="Red" />
          <ColorSwatch name="Info" value="#0d9488" description="Teal" />
        </div>
      </section>
    </div>
  );
}

export const Colors: StoryObj = {
  render: () => <ColorPalette />,
};

// ============================================
// TYPOGRAPHY
// ============================================

function TypographyShowcase() {
  return (
    <div className="space-y-12 bg-cream p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Typography</h1>
        <p className="text-gray">Font families, sizes, and weights for Sphinx</p>
      </div>

      {/* Font Families */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Font Families</h2>
        <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <div className="border-b border-sage pb-6">
            <p className="mb-2 text-sm font-medium text-gray">Primary / Sans (Outfit)</p>
            <p className="font-sans text-4xl text-dark">Outfit</p>
            <p className="mt-2 font-sans text-lg text-gray">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-sans text-lg text-gray">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-sans text-lg text-gray">0123456789</p>
          </div>
          <div className="border-b border-sage pb-6">
            <p className="mb-2 text-sm font-medium text-gray">Chat (Inter)</p>
            <p className="font-chat text-4xl text-dark">Inter</p>
            <p className="mt-2 font-chat text-lg text-gray">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-chat text-lg text-gray">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-chat text-lg text-gray">0123456789</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray">Handwritten (Reenie Beanie)</p>
            <p className="font-handwritten text-5xl text-dark">Reenie Beanie</p>
            <p className="mt-2 font-handwritten text-2xl text-gray">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-handwritten text-2xl text-gray">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-handwritten text-2xl text-gray">0123456789</p>
          </div>
        </div>
      </section>

      {/* Type Scale */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Type Scale</h2>
        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">H1 / 96px</span>
            <p className="text-[96px] font-bold leading-none tracking-[-2.4px] text-dark">H1</p>
          </div>
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">H2 / 60px</span>
            <p className="text-[60px] font-bold leading-none text-dark">Heading 2</p>
          </div>
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">H3 / 36px</span>
            <p className="text-[36px] font-bold leading-[1.2] text-dark">Heading 3</p>
          </div>
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">H4 / 24px</span>
            <p className="text-[24px] font-bold leading-[1.33] text-dark">Heading 4</p>
          </div>
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">body / 18px</span>
            <p className="text-[18px] leading-[1.56] text-dark">Body text for content</p>
          </div>
          <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
            <span className="w-20 text-xs font-medium text-gray">body-sm / 14px</span>
            <p className="text-[14px] leading-[1.43] text-dark">Small body text</p>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-20 text-xs font-medium text-gray">caption / 12px</span>
            <p className="text-[12px] leading-[1.33] text-dark">Caption text</p>
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Font Weights</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-normal text-dark">Aa</p>
            <p className="mt-2 text-sm font-medium text-gray">Normal</p>
            <p className="text-xs text-gray/70">400</p>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-medium text-dark">Aa</p>
            <p className="mt-2 text-sm font-medium text-gray">Medium</p>
            <p className="text-xs text-gray/70">500</p>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-semibold text-dark">Aa</p>
            <p className="mt-2 text-sm font-medium text-gray">Semibold</p>
            <p className="text-xs text-gray/70">600</p>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-dark">Aa</p>
            <p className="mt-2 text-sm font-medium text-gray">Bold</p>
            <p className="text-xs text-gray/70">700</p>
          </div>
        </div>
      </section>

      {/* Text Styles in Use */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Text Styles in Use</h2>
        <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray">Page Title</p>
            <p className="text-4xl font-bold text-dark">Mental wellness, simplified</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray">Section Heading</p>
            <p className="text-2xl font-semibold text-dark">Your Clarity Report</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray">Body Text</p>
            <p className="text-base leading-relaxed text-dark">
              Sphinx helps you understand your mental health journey through AI-powered assessments and personalized insights.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray">Muted Text</p>
            <p className="text-sm text-gray">Last updated 2 hours ago</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray">Handwritten Accent</p>
            <p className="font-handwritten text-2xl text-coral">clarity begins here</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Typography: StoryObj = {
  render: () => <TypographyShowcase />,
};

// ============================================
// SPACING
// ============================================

function SpacingShowcase() {
  const spacings = tokens.spacing;

  return (
    <div className="space-y-12 bg-cream p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Spacing Scale</h1>
        <p className="text-gray">Consistent spacing tokens for margins, padding, and gaps</p>
      </div>

      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="space-y-4">
          {Object.entries(spacings).map(([name, { value }]) => (
            <div key={name} className="flex items-center gap-6">
              <span className="w-8 text-right font-mono text-sm font-medium text-dark">{name}</span>
              <div className="flex-1">
                <div
                  className="h-8 rounded-md bg-linear-to-r from-coral to-coral-dark"
                  style={{ width: value === "0px" ? "4px" : value }}
                />
              </div>
              <span className="w-16 font-mono text-sm text-gray">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Examples */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Spacing Examples</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-medium text-gray">Tight (4px)</p>
            <div className="flex gap-1">
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-medium text-gray">Default (16px)</p>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-medium text-gray">Relaxed (32px)</p>
            <div className="flex gap-8">
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
              <div className="h-8 w-8 rounded bg-sage" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Spacing: StoryObj = {
  render: () => <SpacingShowcase />,
};

// ============================================
// BORDER RADIUS
// ============================================

function RadiusShowcase() {
  const radii = tokens.radii;

  return (
    <div className="space-y-12 bg-cream p-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Border Radius</h1>
        <p className="text-gray">Corner radius tokens for rounded elements</p>
      </div>

      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap gap-8">
          {Object.entries(radii).map(([name, { value }]) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div
                className="flex h-24 w-24 items-center justify-center border-2 border-coral bg-coral/10"
                style={{ borderRadius: value }}
              >
                <span className="font-mono text-xs text-coral-dark">{value}</span>
              </div>
              <span className="text-sm font-medium text-dark">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Radius in Context */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-dark">Radius in Context</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray">Small (6px)</p>
            <p className="mt-2 text-dark">Chips, tags, small buttons</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray">XL (14px)</p>
            <p className="mt-2 text-dark">Cards, modals, panels</p>
          </div>
          <div className="rounded-full bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray">Full (9999px)</p>
            <p className="mt-2 text-dark">Pills, avatars, badges</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Radius: StoryObj = {
  render: () => <RadiusShowcase />,
};

// ============================================
// COMPLETE DESIGN TOKENS (All in One)
// For story.to.design export - all tokens in single component
// ============================================

function AllDesignTokens() {
  const primitives = tokens.colors.primitives;
  const spacings = tokens.spacing;
  const radii = tokens.radii;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-sage bg-white px-8 py-12">
        <h1 className="text-4xl font-bold text-dark">Sphinx Design Tokens</h1>
        <p className="mt-2 text-lg text-gray">Complete design system foundation</p>
      </div>

      {/* ========== COLORS ========== */}
      <div className="border-b border-sage p-8">
        <h2 className="mb-8 text-2xl font-bold text-dark">Color Palette</h2>

        {/* Brand Colors */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray">Brand Colors</h3>
          <div className="flex flex-wrap gap-6">
            {[
              { name: "Cream", value: "#fdfcf8", desc: "Background" },
              { name: "Dark", value: "#292524", desc: "Text" },
              { name: "Sage", value: "#d4e4d4", desc: "Secondary" },
              { name: "Coral", value: "#ffb7b2", desc: "Accent" },
              { name: "Lavender", value: "#efedf4", desc: "Muted" },
            ].map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-xl border border-sage" style={{ backgroundColor: c.value }} />
                <span className="text-sm font-medium text-dark">{c.name}</span>
                <span className="font-mono text-xs text-gray">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All Primitives */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray">All Primitives</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(primitives).map(([name, { value }]) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div className="h-12 w-12 rounded-lg border border-sage" style={{ backgroundColor: value }} />
                <span className="text-xs font-medium text-dark">{name}</span>
                <span className="font-mono text-[10px] text-gray">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray">Semantic Colors</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(SEMANTIC_COLORS).map(([name, { value, description }]) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <div className="h-12 w-12 rounded-lg border border-sage" style={{ backgroundColor: value }} />
                <span className="text-xs font-medium text-dark">{name}</span>
                <span className="text-[10px] text-gray">{description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray">Status Colors</h3>
          <div className="flex gap-6">
            {[
              { name: "Success", value: "#10b981" },
              { name: "Warning", value: "#d97706" },
              { name: "Error", value: "#dc2626" },
              { name: "Info", value: "#0d9488" },
            ].map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div className="h-12 w-12 rounded-lg border border-sage" style={{ backgroundColor: c.value }} />
                <span className="text-xs font-medium text-dark">{c.name}</span>
                <span className="font-mono text-[10px] text-gray">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== TYPOGRAPHY ========== */}
      <div className="border-b border-sage p-8">
        <h2 className="mb-8 text-2xl font-bold text-dark">Typography</h2>

        {/* Font Families */}
        <div className="mb-8 rounded-xl bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray">Font Families</h3>
          <div className="space-y-4">
            <div className="border-b border-sage/50 pb-4">
              <p className="text-xs text-gray">Primary / Sans (Outfit)</p>
              <p className="font-sans text-3xl text-dark">Aa Bb Cc 123</p>
            </div>
            <div className="border-b border-sage/50 pb-4">
              <p className="text-xs text-gray">Chat (Inter)</p>
              <p className="font-chat text-3xl text-dark">Aa Bb Cc 123</p>
            </div>
            <div>
              <p className="text-xs text-gray">Handwritten (Reenie Beanie)</p>
              <p className="font-handwritten text-4xl text-dark">Aa Bb Cc 123</p>
            </div>
          </div>
        </div>

        {/* Type Scale */}
        <div className="mb-8 rounded-xl bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray">Type Scale</h3>
          <div className="space-y-3">
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">H1 / 96px</span><p className="text-[48px] font-bold text-dark">H1</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">H2 / 60px</span><p className="text-[36px] font-bold text-dark">Heading 2</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">H3 / 36px</span><p className="text-[36px] font-bold text-dark">Heading 3</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">H4 / 24px</span><p className="text-[24px] font-bold text-dark">Heading 4</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">body / 18px</span><p className="text-[18px] text-dark">Body text</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">body-sm / 14px</span><p className="text-[14px] text-dark">Small text</p></div>
            <div className="flex items-baseline gap-4"><span className="w-20 text-xs text-gray">caption / 12px</span><p className="text-[12px] text-dark">Caption</p></div>
          </div>
        </div>

        {/* Weights */}
        <div className="rounded-xl bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray">Font Weights</h3>
          <div className="flex gap-8">
            <div className="text-center"><p className="text-2xl font-normal text-dark">Aa</p><p className="text-xs text-gray">Normal 400</p></div>
            <div className="text-center"><p className="text-2xl font-medium text-dark">Aa</p><p className="text-xs text-gray">Medium 500</p></div>
            <div className="text-center"><p className="text-2xl font-semibold text-dark">Aa</p><p className="text-xs text-gray">Semibold 600</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-dark">Aa</p><p className="text-xs text-gray">Bold 700</p></div>
          </div>
        </div>
      </div>

      {/* ========== SPACING ========== */}
      <div className="border-b border-sage p-8">
        <h2 className="mb-8 text-2xl font-bold text-dark">Spacing</h2>
        <div className="rounded-xl bg-white p-6">
          <div className="space-y-3">
            {Object.entries(spacings).map(([name, { value }]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-8 text-right font-mono text-sm text-dark">{name}</span>
                <div className="h-6 rounded bg-coral" style={{ width: value === "0px" ? "2px" : value }} />
                <span className="font-mono text-sm text-gray">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== RADIUS ========== */}
      <div className="p-8">
        <h2 className="mb-8 text-2xl font-bold text-dark">Border Radius</h2>
        <div className="flex flex-wrap gap-6 rounded-xl bg-white p-6">
          {Object.entries(radii).map(([name, { value }]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="flex h-16 w-16 items-center justify-center border-2 border-coral bg-coral/10"
                style={{ borderRadius: value }}
              >
                <span className="font-mono text-[10px] text-coral-dark">{value}</span>
              </div>
              <span className="text-xs font-medium text-dark">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const AllTokens: StoryObj = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => <AllDesignTokens />,
};
