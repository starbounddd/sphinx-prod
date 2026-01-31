import type { JSX } from "react";
import { Bell, Plus } from "lucide-react";
import { PrimaryButton } from "@/shared/ui/buttons";
import { Typography } from "@/shared/ui/typography";

interface ProviderHeaderProps {
  title: string;
  showNewPatient?: boolean;
  notificationCount?: number;
  onNewPatient?: () => void;
}

/**
 * Provider portal header with title, notifications, and action button
 */
export function ProviderHeader({
  title,
  showNewPatient = true,
  notificationCount = 0,
  onNewPatient,
}: ProviderHeaderProps): JSX.Element {
  return (
    <header className="flex w-full items-center justify-between border-b border-sage/50 bg-white/50 px-8 py-6 backdrop-blur-sm">
      <Typography size="h2" className="text-2xl font-semibold text-dark lg:text-3xl">
        {title}
      </Typography>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray transition-colors hover:text-dark">
          <Bell className="h-6 w-6" />
          {notificationCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-coral" />
          )}
        </button>

        {/* New Patient Button */}
        {showNewPatient && (
          <PrimaryButton onClick={onNewPatient} className="gap-2 px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" />
            New Patient
          </PrimaryButton>
        )}
      </div>
    </header>
  );
}
