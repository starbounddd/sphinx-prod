import type { JSX } from "react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/shadcn/card";

const COLORS = [
  { name: "black", value: "#000000" },
  { name: "white", value: "#ffffff" },
  { name: "dark", value: "#292524" },
  { name: "gray", value: "#78716c" },
  { name: "sage", value: "#e8efe8" },
  { name: "lavender", value: "#efedf4" },
  { name: "cream", value: "#fdfcf8" },
  { name: "coral", value: "#ffb7b2" },
];

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      className="h-16 w-16 rounded-2xl shadow-sm"
      style={{ backgroundColor: value }}
      title={`${name}: ${value}`}
    />
  );
}

/**
 * Design System Board
 * Displays typography system and color palette for reference
 */
export default function DesignSystemPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-stone p-8 lg:p-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        {/* Typography System */}
        <section>
          <Typography size="caption" color="muted" className="mb-4 uppercase tracking-wider">
            Sphinx Typography Systems
          </Typography>
          <Card className="space-y-6 rounded-3xl border-0 bg-white p-8 shadow-sm">
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                H1
              </Typography>
              <Typography size="h1">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                H2
              </Typography>
              <Typography size="h2">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                H3
              </Typography>
              <Typography size="h3">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                H4
              </Typography>
              <Typography size="h4">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                Body
              </Typography>
              <Typography size="body">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                Body Small
              </Typography>
              <Typography size="body-sm">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4 border-b border-sage/50 pb-4">
              <Typography size="caption" color="muted" className="w-24">
                Caption
              </Typography>
              <Typography size="caption">Aa</Typography>
            </div>
            <div className="flex items-baseline gap-4">
              <Typography size="caption" color="muted" className="w-24">
                Handwritten
              </Typography>
              <Typography font="handwritten" size="h2">Aa</Typography>
            </div>
          </Card>
        </section>

        {/* Color Palette */}
        <section>
          <Typography size="caption" color="muted" className="mb-4 uppercase tracking-wider">
            Sphinx Color Palette
          </Typography>
          <div className="rounded-3xl bg-gray p-8">
            <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
              {COLORS.map((color) => (
                <ColorSwatch key={color.name} {...color} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
