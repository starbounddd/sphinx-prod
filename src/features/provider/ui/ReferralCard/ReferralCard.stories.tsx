import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReferralCard } from "./ReferralCard";

const meta: Meta<typeof ReferralCard> = {
  title: "Provider/ReferralCard",
  component: ReferralCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReferralCard>;

export const Active: Story = {
  args: {
    patientInitials: "JD",
    patientName: "Jane Doe",
    referredBy: "Dr. Sarah Chen (GP)",
    age: 28,
    paymentType: "insured",
    intakeNote:
      "I've been feeling constantly on edge for the past 3 months. It's affecting my sleep and my ability to focus at work. I tried meditation but my mind won't quiet down.",
    sphinxSummary: {
      symptoms: ["Generalized Anxiety", "Insomnia", "Brain Fog"],
      riskLevel: "moderate",
      riskLabel: "Moderate Distress",
      aiInsight:
        "Patient exhibits patterns of catastrophic thinking in journal entries from past 2 weeks.",
    },
    status: "active",
    onAccept: () => console.log("Accepted"),
    onDecline: () => console.log("Declined"),
  },
};

export const HighRisk: Story = {
  args: {
    patientInitials: "MK",
    patientName: "Michael Key",
    referredBy: "Self-Referral",
    age: 34,
    paymentType: "self-pay",
    intakeNote:
      "Looking for help with recent mood swings. I feel great for a few days then crash hard. It's confusing.",
    sphinxSummary: {
      symptoms: ["Mood Lability", "Impulsivity"],
      riskLevel: "high",
      riskLabel: "High Variability",
      aiInsight:
        "AI detected rapid sentiment shifts within 48-hour windows over the last month.",
    },
    status: "active",
    onAccept: () => console.log("Accepted"),
    onDecline: () => console.log("Declined"),
  },
};

export const Pending: Story = {
  args: {
    patientInitials: "AS",
    patientName: "Alex Smith",
    referredBy: "Dr. Johnson (Neurologist)",
    age: 42,
    paymentType: "insured",
    intakeNote:
      "Recent diagnosis of chronic fatigue. Looking for mental health support to cope with lifestyle changes.",
    sphinxSummary: {
      symptoms: ["Fatigue", "Low Mood", "Adjustment Issues"],
      riskLevel: "low",
      riskLabel: "Low Risk",
      aiInsight:
        "Patient shows resilience markers but may benefit from CBT approaches.",
    },
    status: "pending",
  },
};
