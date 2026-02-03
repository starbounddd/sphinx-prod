import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TertiaryButton } from "./TertiaryButton";
import { GhostButton } from "./GhostButton";

const meta: Meta = {
  title: "Shared/Buttons/All Buttons",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Primary</span>
        <PrimaryButton>Get Started</PrimaryButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Primary with Shimmer</span>
        <PrimaryButton shimmer>Start Assessment</PrimaryButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Primary with Arrow</span>
        <PrimaryButton showArrow>Continue</PrimaryButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Secondary (Outline)</span>
        <SecondaryButton>Learn More</SecondaryButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Tertiary (Sage)</span>
        <TertiaryButton>Secondary Action</TertiaryButton>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Ghost</span>
        <GhostButton>Cancel</GhostButton>
      </div>
    </div>
  ),
};

export const HoverStates: Story = {
  name: "Hover States (Interactive)",
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-gray max-w-md text-center">
        Hover over each button to see the enhanced hover effects with scale, shadow, and color transitions.
      </p>

      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Default</span>
          <PrimaryButton>Primary CTA</PrimaryButton>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Hover me</span>
          <PrimaryButton className="bg-primary-btn-dark text-white -translate-y-px shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
            Primary CTA
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Default</span>
          <SecondaryButton>Secondary</SecondaryButton>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Hover me</span>
          <SecondaryButton className="bg-dark text-white scale-[1.02] shadow-[0_4px_14px_0_rgba(41,37,36,0.25)]">
            Secondary
          </SecondaryButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Default</span>
          <TertiaryButton>Tertiary</TertiaryButton>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Hover me</span>
          <TertiaryButton className="scale-[1.02] shadow-[0_4px_14px_0_rgba(212,228,212,0.6)]">
            Tertiary
          </TertiaryButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Default</span>
          <GhostButton>Ghost</GhostButton>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray">Hover me</span>
          <GhostButton className="bg-dark/8 scale-[1.02]">
            Ghost
          </GhostButton>
        </div>
      </div>
    </div>
  ),
};

export const ButtonPairs: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Hero CTA Pair</span>
        <div className="flex gap-4">
          <PrimaryButton shimmer showArrow>Start Free Check-in</PrimaryButton>
          <SecondaryButton>For Providers</SecondaryButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Form Actions</span>
        <div className="flex gap-4">
          <PrimaryButton>Submit</PrimaryButton>
          <GhostButton>Cancel</GhostButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray">Secondary Flow</span>
        <div className="flex gap-4">
          <TertiaryButton>Save Draft</TertiaryButton>
          <GhostButton>Discard</GhostButton>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  name: "Interactive Demo",
  render: () => (
    <div className="flex flex-col gap-6 p-8 bg-cream rounded-2xl">
      <p className="text-center text-dark font-medium">
        Try hovering and clicking each button to experience the transitions
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <PrimaryButton showArrow>Primary</PrimaryButton>
        <SecondaryButton>Secondary</SecondaryButton>
        <TertiaryButton>Tertiary</TertiaryButton>
        <GhostButton>Ghost</GhostButton>
      </div>
    </div>
  ),
};
