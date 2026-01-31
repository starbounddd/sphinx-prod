"use client";

import type { JSX } from "react";
import { useState } from "react";
import {
  ProviderSidebar,
  ProviderHeader,
  FilterTabs,
  ReferralCard,
} from "@/features/provider/ui";

const FILTER_TABS = [
  { id: "all", label: "All Referrals" },
  { id: "high-risk", label: "High Risk" },
  { id: "anxiety", label: "Anxiety Disorders" },
  { id: "depression", label: "Depression" },
];

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
      "Looking for help with recent mood swings. I feel great for a few days then crash hard. It's confusing.",
    sphinxSummary: {
      symptoms: ["Mood Lability", "Impulsivity"],
      riskLevel: "high" as const,
      riskLabel: "High Variability",
      aiInsight:
        "AI detected rapid sentiment shifts within 48-hour windows over the last month.",
    },
    status: "active" as const,
  },
];

/**
 * Provider Dashboard - Incoming Referrals
 * Main view for providers to review and accept patient referrals
 */
export default function ProviderDashboard(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleAccept = (id: string) => {
    console.log("Accepted referral:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Declined referral:", id);
  };

  return (
    <>
      {/* Sidebar */}
      <ProviderSidebar
        activeTab="dashboard"
        inboxCount={3}
        providerName="Dr. Smith"
        providerRole="Psychiatrist"
        providerAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBWdDHjno7kehn3ZkR7ZLWFl6Wp3eXynUu33WO1b9iTFgiabgaSBbnWSz0ZJ2Ezbd4Ek6nL1QA9kj28Veem1BfEfSJnTOuBz3VOCqMx2630wZTSvTFE1Dt7RzfxcA5qNpU4VB9MG63kPlfrOwI380LHP-p2sh2VeDTBQA7NN1-BXSSZqOgPmLpTOXKHjDNuQPqOlsPuDD_WcK9tety4fCaG4i7nW1NLFJqw6keFYcm2_7hQURtWNpSjtVHkGnkRRSq0QJKMsTKjFtI"
      />

      {/* Main Content */}
      <main className="relative flex h-full flex-grow flex-col overflow-hidden">
        <ProviderHeader
          title="Incoming Referrals"
          notificationCount={1}
        />

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto bg-cream p-4 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Filter Tabs */}
            <FilterTabs
              tabs={FILTER_TABS}
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />

            {/* Referral Cards */}
            {MOCK_REFERRALS.map((referral) => (
              <ReferralCard
                key={referral.id}
                {...referral}
                onAccept={() => handleAccept(referral.id)}
                onDecline={() => handleDecline(referral.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
