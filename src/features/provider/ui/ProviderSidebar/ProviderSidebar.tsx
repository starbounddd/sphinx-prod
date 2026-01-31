"use client";

import type { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Calendar,
} from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

function NavItem({ href, icon, label, active = false, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl px-4 py-3 font-medium transition-colors",
        active
          ? "bg-lavender font-bold text-dark"
          : "text-gray hover:bg-sage/50 hover:text-dark"
      )}
    >
      <span className={cn("text-current", active && "text-dark")}>{icon}</span>
      <span className="hidden lg:block">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto hidden h-6 w-6 items-center justify-center rounded-full bg-coral text-xs font-bold text-dark lg:flex">
          {badge}
        </span>
      )}
    </Link>
  );
}

interface ProviderSidebarProps {
  activeTab?: "dashboard" | "inbox" | "patients" | "schedule";
  inboxCount?: number;
  providerName?: string;
  providerRole?: string;
  providerAvatar?: string;
}

/**
 * Provider portal sidebar navigation
 * Collapsible on mobile, full width on desktop
 */
export function ProviderSidebar({
  activeTab = "dashboard",
  inboxCount = 0,
  providerName = "Dr. Smith",
  providerRole = "Psychiatrist",
  providerAvatar,
}: ProviderSidebarProps): JSX.Element {
  return (
    <aside className="flex h-full w-20 shrink-0 flex-col border-r border-sage/50 bg-white px-4 py-8 lg:w-64">
      {/* Logo */}
      <Link href="/provider" className="mb-8 px-2 lg:px-4">
        <Image
          src="/images/logo/sphinx-logo.svg"
          alt="Sphinx"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavItem
          href="/provider"
          icon={<LayoutDashboard className="h-6 w-6" />}
          label="Dashboard"
          active={activeTab === "dashboard"}
        />
        <NavItem
          href="/provider/inbox"
          icon={<Inbox className="h-6 w-6" />}
          label="Inbox"
          active={activeTab === "inbox"}
          badge={inboxCount}
        />
        <NavItem
          href="/provider/patients"
          icon={<Users className="h-6 w-6" />}
          label="Patients"
          active={activeTab === "patients"}
        />
        <NavItem
          href="/provider/schedule"
          icon={<Calendar className="h-6 w-6" />}
          label="Schedule"
          active={activeTab === "schedule"}
        />
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="h-px w-full bg-sage/50" />
        <Link
          href="/provider/settings"
          className="flex items-center gap-4 px-4 py-2 text-gray transition-colors hover:text-dark"
        >
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-sage">
            {providerAvatar ? (
              <img
                src={providerAvatar}
                alt={providerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-dark">
                {providerName.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden flex-col lg:flex">
            <Typography size="body-sm" className="font-bold text-dark">
              {providerName}
            </Typography>
            <Typography size="caption" className="text-gray">
              {providerRole}
            </Typography>
          </div>
        </Link>
      </div>
    </aside>
  );
}
