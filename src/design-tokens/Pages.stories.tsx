import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Navigation
import { Navbar, Footer } from "@/shared/ui/navigation";

// Landing Sections
import {
  Hero,
  QuoteSection,
  PhoneShowcase,
  FeatureGrid,
  CTASection,
} from "@/app/(landing)/_sections";

// Assessment
import { ClarityReport } from "@/features/assessment/ui";
import type { ClarityReport as ClarityReportType } from "@/features/assessment/types";

// Provider
import {
  ProviderSidebar,
  ProviderHeader,
  FilterTabs,
  ReferralCard,
} from "@/features/provider/ui";

const meta: Meta = {
  title: "Design System/Pages",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

// ============================================
// LANDING PAGE
// ============================================

export const LandingPage: Story = {
  render: () => (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <QuoteSection />
      <PhoneShowcase />
      <FeatureGrid />
      <CTASection />
      <Footer />
    </div>
  ),
};

// ============================================
// ASSESSMENT CHAT (Static Preview)
// ============================================

import { AssessmentHeader, ThinkingIndicator, QuickReplyBar } from "@/features/assessment/ui";
import { ChatMessage, ChatInput } from "@/shared/ui/chat";

export const AssessmentChatPage: Story = {
  render: () => (
    <div className="relative flex h-screen flex-col overflow-hidden bg-cream">
      {/* Header */}
      <AssessmentHeader title="Sphinx Assessment" />

      {/* Messages area */}
      <div className="relative z-10 flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-4">
          {/* AI Message */}
          <div className="grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_0.5fr] gap-4">
            <div />
            <div>
              <ChatMessage variant="ai">
                Hi there! I&apos;m Sphinx, your mental wellness guide. I&apos;m here to help you understand what you&apos;re going through. How are you feeling today?
              </ChatMessage>
            </div>
            <div />
            <div />
            <div />
          </div>

          {/* User Message */}
          <div className="grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_0.5fr] gap-4">
            <div />
            <div />
            <div />
            <div>
              <ChatMessage variant="user">
                I&apos;ve been feeling really overwhelmed lately, especially at work.
              </ChatMessage>
            </div>
            <div />
          </div>

          {/* AI Response */}
          <div className="grid grid-cols-[0.5fr_1.5fr_2fr_1.5fr_0.5fr] gap-4">
            <div />
            <div>
              <ChatMessage variant="ai">
                I hear you. Feeling overwhelmed at work is something many people experience. Can you tell me more about what&apos;s been contributing to this feeling?
              </ChatMessage>
            </div>
            <div />
            <div />
            <div />
          </div>

          {/* Thinking indicator */}
          <div className="flex justify-center px-6 py-4">
            <ThinkingIndicator />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 bg-gradient-to-t from-cream via-cream/95 to-cream/0 pb-8 pt-6">
        <QuickReplyBar
          options={["Work stress", "Can't sleep", "Feeling anxious"]}
          onSelect={() => {}}
          className="justify-center pb-5"
        />
        <div className="mx-auto max-w-xl px-6">
          <ChatInput
            value=""
            onChange={() => {}}
            onSend={() => {}}
            placeholder="Share what's on your mind..."
          />
        </div>
      </div>
    </div>
  ),
};

// ============================================
// ASSESSMENT REPORT
// ============================================

const MOCK_REPORT: ClarityReportType = {
  id: "report-1",
  userQuote: "I've been feeling constantly on edge, especially in social situations. My heart races and I can't seem to calm down.",
  analysisHighlight: "Social Anxiety",
  analysis: "with Physical Symptoms - Your body's stress response is activated in social situations, causing physical symptoms like rapid heartbeat.",
  findings: [
    {
      id: "1",
      icon: "zap",
      title: "Triggers Identified",
      description: "Large gatherings, public speaking, unstructured social time",
    },
    {
      id: "2",
      icon: "clock",
      title: "Duration",
      description: "Persistent for 6+ months with increasing frequency",
    },
    {
      id: "3",
      icon: "activity",
      title: "Intensity Level",
      description: "High - significantly impacts daily functioning and work",
    },
    {
      id: "4",
      icon: "calendar",
      title: "Pattern Onset",
      description: "Gradual onset, worsened after recent life changes",
    },
  ],
  createdAt: new Date(),
};

export const AssessmentReportPage: Story = {
  render: () => <ClarityReport report={MOCK_REPORT} />,
};

// ============================================
// PROVIDER PORTAL
// ============================================

const MOCK_REFERRALS = [
  {
    id: "1",
    patientInitials: "JD",
    patientName: "Jane Doe",
    referredBy: "Dr. Sarah Chen (GP)",
    age: 28,
    paymentType: "insured" as const,
    intakeNote:
      "I've been feeling constantly on edge for the past 3 months. It's affecting my sleep and my ability to focus at work. I tried meditation but my mind won't quiet down.",
    sphinxSummary: {
      symptoms: ["Generalized Anxiety", "Insomnia", "Brain Fog"],
      riskLevel: "moderate" as const,
      riskLabel: "Moderate Distress",
      aiInsight:
        "Patient exhibits patterns of catastrophic thinking in journal entries from past 2 weeks.",
    },
    status: "active" as const,
  },
  {
    id: "2",
    patientInitials: "MK",
    patientName: "Michael Key",
    referredBy: "Self-Referral",
    age: 34,
    paymentType: "self-pay" as const,
    intakeNote:
      "Looking for help with recent mood swings. I feel great for a few days then crash hard. It's confusing and my family is worried.",
    sphinxSummary: {
      symptoms: ["Mood Lability", "Impulsivity", "Sleep Disruption"],
      riskLevel: "high" as const,
      riskLabel: "High Variability",
      aiInsight:
        "AI detected rapid sentiment shifts within 48-hour windows over the last month.",
    },
    status: "active" as const,
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Referrals" },
  { id: "high-risk", label: "High Risk" },
  { id: "anxiety", label: "Anxiety Disorders" },
  { id: "depression", label: "Depression" },
];

export const ProviderPortalPage: Story = {
  render: () => (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <ProviderSidebar
        activeTab="dashboard"
        inboxCount={3}
        providerName="Dr. Smith"
        providerRole="Psychiatrist"
      />

      {/* Main Content */}
      <main className="relative flex h-full flex-grow flex-col overflow-hidden">
        <ProviderHeader
          title="Incoming Referrals"
          notificationCount={2}
        />

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto bg-cream p-4 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Filter Tabs */}
            <FilterTabs
              tabs={FILTER_TABS}
              activeTab="all"
              onTabChange={() => {}}
            />

            {/* Referral Cards */}
            {MOCK_REFERRALS.map((referral) => (
              <ReferralCard
                key={referral.id}
                {...referral}
                onAccept={() => {}}
                onDecline={() => {}}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  ),
};
