import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// ============================================
// SHARED COMPONENTS
// ============================================
import { Typography } from "@/shared/ui/typography";
import { PrimaryButton, SecondaryButton, TertiaryButton, GhostButton } from "@/shared/ui/buttons";
import { ChatInput, ChatMessage, QuickReplyChip } from "@/shared/ui/chat";
import { Navbar, Footer } from "@/shared/ui/navigation";
import { ShimmerButton, BorderBeam, WordFadeIn } from "@/shared/ui/magicui";

// ============================================
// LANDING PAGE COMPONENTS
// ============================================
import {
  Hero,
  QuoteSection,
  PhoneShowcase,
  FeatureGrid,
  CTASection,
} from "@/app/(landing)/_sections";

// ============================================
// ASSESSMENT PAGE COMPONENTS
// ============================================
import {
  AssessmentHeader,
  ThinkingIndicator,
  QuickReplyBar,
  SummaryCard,
  FindingCard,
  ReportFooter,
  ClarityReport,
} from "@/features/assessment/ui";
import type { ClarityReport as ClarityReportType } from "@/features/assessment/types";

// ============================================
// PROVIDER PAGE COMPONENTS
// ============================================
import {
  ProviderSidebar,
  ProviderHeader,
  MatchScoreBadge,
  PatientTag,
  PatientStats,
  AIInsights,
  KeyContext,
  FilterTabs,
  SphinxSummary,
  ReferralCard,
} from "@/features/provider/ui";

const meta: Meta = {
  title: "Design System/All Components",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

// ============================================
// MOCK DATA
// ============================================

const MOCK_REPORT: ClarityReportType = {
  id: "report-1",
  userQuote: "I've been feeling constantly on edge, especially in social situations.",
  analysisHighlight: "Social Anxiety",
  analysis: "with Physical Symptoms - causing rapid heartbeat in social situations.",
  findings: [
    { id: "1", icon: "zap", title: "Triggers", description: "Large gatherings, public speaking" },
    { id: "2", icon: "clock", title: "Duration", description: "6+ months" },
    { id: "3", icon: "activity", title: "Intensity", description: "High impact" },
    { id: "4", icon: "calendar", title: "Onset", description: "Gradual" },
  ],
  createdAt: new Date(),
};

const MOCK_REFERRAL = {
  id: "1",
  patientInitials: "JD",
  patientName: "Jane Doe",
  referredBy: "Dr. Sarah Chen (GP)",
  age: 28,
  paymentType: "insured" as const,
  intakeNote: "I've been feeling constantly on edge for the past 3 months.",
  sphinxSummary: {
    symptoms: ["Generalized Anxiety", "Insomnia", "Brain Fog"],
    riskLevel: "moderate" as const,
    riskLabel: "Moderate Distress",
    aiInsight: "Patient exhibits patterns of catastrophic thinking.",
  },
  status: "active" as const,
};

// ============================================
// MAIN EXPORT: ALL COMPONENTS BY PAGE
// ============================================

export const FullDesignSystem: Story = {
  render: () => (
    <div className="min-h-screen bg-cream">
      {/* ============================================ */}
      {/* SHARED COMPONENTS */}
      {/* ============================================ */}
      <div className="border-b-4 border-coral p-8">
        <h1 className="mb-8 text-3xl font-bold text-dark">Shared Components</h1>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Typography</h2>
          <div className="space-y-2 rounded-2xl bg-white p-6">
            <Typography size="h1">H1 Heading</Typography>
            <Typography size="h2">H2 Heading</Typography>
            <Typography size="h3">H3 Heading</Typography>
            <Typography size="h4">H4 Heading</Typography>
            <Typography size="body">Body text</Typography>
            <Typography size="body-sm">Body Small</Typography>
            <Typography size="caption">Caption</Typography>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Buttons</h2>
          <div className="flex flex-wrap gap-4 rounded-2xl bg-white p-6">
            <PrimaryButton>Primary</PrimaryButton>
            <PrimaryButton showArrow>With Arrow</PrimaryButton>
            <SecondaryButton>Secondary</SecondaryButton>
            <TertiaryButton>Tertiary</TertiaryButton>
            <GhostButton>Ghost</GhostButton>
            <ShimmerButton>Shimmer</ShimmerButton>
          </div>
        </section>

        {/* Chat */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Chat Components</h2>
          <div className="space-y-4 rounded-2xl bg-white p-6">
            <div className="flex gap-4">
              <ChatMessage variant="ai">AI message</ChatMessage>
              <ChatMessage variant="user">User message</ChatMessage>
            </div>
            <div className="flex gap-2">
              <QuickReplyChip>Option 1</QuickReplyChip>
              <QuickReplyChip>Option 2</QuickReplyChip>
            </div>
            <ChatInput value="" onChange={() => {}} onSend={() => {}} placeholder="Type..." />
          </div>
        </section>

        {/* Navigation */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Navigation</h2>
          <div className="overflow-hidden rounded-2xl border [&_header]:static [&_header]:pt-4">
            <Navbar />
            <div className="h-20 bg-sage/20" />
            <Footer />
          </div>
        </section>

        {/* Effects */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray">Effects</h2>
          <div className="flex items-center gap-8 rounded-2xl bg-white p-6">
            <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-sage">
              <BorderBeam size={60} duration={4} />
              <span className="absolute inset-0 flex items-center justify-center text-sm text-dark">BorderBeam</span>
            </div>
            <WordFadeIn words="Word Fade In" />
          </div>
        </section>
      </div>

      {/* ============================================ */}
      {/* LANDING PAGE */}
      {/* ============================================ */}
      <div className="border-b-4 border-coral p-8">
        <h1 className="mb-8 text-3xl font-bold text-dark">Landing Page</h1>

        {/* Full Page Preview */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Full Page</h2>
          <div className="overflow-hidden rounded-2xl border shadow-lg [&_header]:static [&_header]:pt-4">
            <div className="max-h-[600px] overflow-y-auto">
              <Navbar />
              <Hero />
              <QuoteSection />
              <PhoneShowcase />
              <FeatureGrid />
              <CTASection />
              <Footer />
            </div>
          </div>
        </section>

        {/* Individual Sections */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray">Sections</h2>
          <div className="space-y-6">
            <div className="rounded-2xl border bg-cream p-4">
              <p className="mb-2 text-sm font-medium text-gray">Hero</p>
              <Hero />
            </div>
            <div className="rounded-2xl border bg-cream p-4">
              <p className="mb-2 text-sm font-medium text-gray">Quote Section</p>
              <QuoteSection />
            </div>
            <div className="rounded-2xl border bg-cream p-4">
              <p className="mb-2 text-sm font-medium text-gray">Phone Showcase</p>
              <PhoneShowcase />
            </div>
            <div className="rounded-2xl border bg-cream p-4">
              <p className="mb-2 text-sm font-medium text-gray">Feature Grid</p>
              <FeatureGrid />
            </div>
            <div className="rounded-2xl border bg-cream p-4">
              <p className="mb-2 text-sm font-medium text-gray">CTA Section</p>
              <CTASection />
            </div>
          </div>
        </section>
      </div>

      {/* ============================================ */}
      {/* ASSESSMENT PAGE */}
      {/* ============================================ */}
      <div className="border-b-4 border-coral p-8">
        <h1 className="mb-8 text-3xl font-bold text-dark">Assessment Page</h1>

        {/* Chat Page Preview */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Chat Page</h2>
          <div className="h-[500px] overflow-hidden rounded-2xl border shadow-lg">
            <div className="flex h-full flex-col bg-cream">
              <AssessmentHeader title="Sphinx Assessment" />
              <div className="flex-1 space-y-4 p-6">
                <ChatMessage variant="ai">Hi! How are you feeling today?</ChatMessage>
                <ChatMessage variant="user">I&apos;ve been feeling overwhelmed.</ChatMessage>
                <ThinkingIndicator />
              </div>
              <div className="border-t bg-cream p-4">
                <QuickReplyBar options={["Anxious", "Tired", "Stressed"]} onSelect={() => {}} />
                <div className="mt-4">
                  <ChatInput value="" onChange={() => {}} onSend={() => {}} placeholder="Share..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Page Preview */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Report Page</h2>
          <div className="max-h-[600px] overflow-y-auto rounded-2xl border shadow-lg">
            <ClarityReport report={MOCK_REPORT} />
          </div>
        </section>

        {/* Individual Components */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray">Components</h2>
          <div className="space-y-6 rounded-2xl bg-white p-6">
            <div>
              <p className="mb-2 text-sm font-medium text-gray">AssessmentHeader</p>
              <AssessmentHeader title="Assessment" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">ThinkingIndicator</p>
              <ThinkingIndicator />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">QuickReplyBar</p>
              <QuickReplyBar options={["Option A", "Option B", "Option C"]} onSelect={() => {}} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">SummaryCard</p>
              <div className="max-w-md">
                <SummaryCard
                  userQuote="I feel overwhelmed"
                  analysis="indicates burnout."
                  analysisHighlight="Your response"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">FindingCard</p>
              <div className="grid grid-cols-2 gap-4">
                <FindingCard icon="zap" title="Triggers" description="Work situations" />
                <FindingCard icon="clock" title="Duration" description="3+ months" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">ReportFooter</p>
              <ReportFooter variant="inline" />
            </div>
          </div>
        </section>
      </div>

      {/* ============================================ */}
      {/* PROVIDER PAGE */}
      {/* ============================================ */}
      <div className="p-8">
        <h1 className="mb-8 text-3xl font-bold text-dark">Provider Page</h1>

        {/* Full Page Preview */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray">Full Page</h2>
          <div className="flex h-[500px] overflow-hidden rounded-2xl border shadow-lg">
            <ProviderSidebar
              activeTab="dashboard"
              inboxCount={3}
              providerName="Dr. Smith"
              providerRole="Psychiatrist"
            />
            <div className="flex flex-1 flex-col">
              <ProviderHeader title="Incoming Referrals" notificationCount={2} />
              <div className="flex-1 overflow-y-auto bg-cream p-4">
                <FilterTabs
                  tabs={[
                    { id: "all", label: "All" },
                    { id: "high", label: "High Risk" },
                  ]}
                  activeTab="all"
                  onTabChange={() => {}}
                />
                <div className="mt-4">
                  <ReferralCard {...MOCK_REFERRAL} onAccept={() => {}} onDecline={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Components */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray">Components</h2>
          <div className="space-y-6 rounded-2xl bg-white p-6">
            <div>
              <p className="mb-2 text-sm font-medium text-gray">ProviderSidebar</p>
              <div className="h-64 w-64 overflow-hidden rounded-xl border">
                <ProviderSidebar activeTab="dashboard" inboxCount={3} providerName="Dr. Smith" providerRole="Psychiatrist" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">ProviderHeader</p>
              <ProviderHeader title="Dashboard" notificationCount={5} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">FilterTabs</p>
              <FilterTabs
                tabs={[
                  { id: "new", label: "New", count: 5 },
                  { id: "reviewing", label: "Reviewing", count: 3 },
                ]}
                activeTab="new"
                onTabChange={() => {}}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">MatchScoreBadge</p>
              <div className="flex gap-4">
                <MatchScoreBadge score={94} />
                <MatchScoreBadge score={78} />
                <MatchScoreBadge score={52} />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">PatientTag</p>
              <div className="flex gap-2">
                <PatientTag label="Anxiety" variant="primary" />
                <PatientTag label="Insured" variant="secondary" />
                <PatientTag label="Age 28" variant="tertiary" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">PatientStats</p>
              <PatientStats duration="3 months" intensity="Moderate" onset="Gradual" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">AIInsights</p>
              <AIInsights>Patient shows strong indicators for generalized anxiety.</AIInsights>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">KeyContext</p>
              <KeyContext items={["Previous CBT", "On medication", "Family support"]} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">SphinxSummary</p>
              <SphinxSummary
                symptoms={["Anxiety", "Insomnia"]}
                riskLevel="moderate"
                riskLabel="Moderate Risk"
                aiInsight="Patient has anxiety symptoms for 3 months."
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray">ReferralCard</p>
              <ReferralCard {...MOCK_REFERRAL} onAccept={() => {}} onDecline={() => {}} />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
