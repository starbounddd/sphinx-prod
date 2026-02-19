import type { JSX } from 'react';
import { FileText, Send, FileBarChart } from 'lucide-react';
import Iphone15Pro from '@/components/ui/shadcn/iphone-15-pro';
import { Container, Section } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';
import { ChatMessage } from '@/components/ui/chat';

export function PhoneShowcase(): JSX.Element {
  return (
    <Section variant="gradient" spacing="lg">
      <Container>
        <div className="mx-auto mb-20 text-center">
          <Typography size="h1" className="mb-6">
            Simple, private, effective
          </Typography>
          <Typography size="body" color="muted">
            A three-step journey from confusion to clarity.
          </Typography>
        </div>

        <div className="relative flex h-[640px] items-center justify-center">
          {/* Start Phone - Left, tilted */}
          <div className="absolute left-[calc(50%-332px)] -translate-x-1/2 -rotate-[8deg] opacity-75">
            <div className="h-[560px] w-[275px]">
              <Iphone15Pro>
                <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-cream to-sage px-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-sage">
                    <FileText className="h-8 w-8 text-dark" strokeWidth={1.5} />
                  </div>
                  <Typography size="h3" className="mb-2">
                    Start
                  </Typography>
                  <Typography size="body" color="muted" align="center">
                    Share what&apos;s on your mind
                  </Typography>
                </div>
              </Iphone15Pro>
            </div>
          </div>

          {/* AI Conversation Phone - Center */}
          <div className="relative z-10">
            <div className="h-[640px] w-[314px]">
              <Iphone15Pro>
                <div className="flex h-full flex-col bg-white px-4 pb-12 pt-10">
                  <div className="mb-4 text-center">
                    <Typography size="h3">AI Conversation</Typography>
                    <Typography size="h4" className="font-normal text-gray">
                      Private & Secure
                    </Typography>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                    <ChatMessage variant="ai">
                      Can you tell me more about when these feelings started?
                    </ChatMessage>
                    <ChatMessage variant="user">
                      Maybe 2 weeks ago? After that work thing...
                    </ChatMessage>
                    <ChatMessage variant="ai">
                      What happens when you think about work?
                    </ChatMessage>
                    <ChatMessage variant="user">
                      My chest gets tight...
                    </ChatMessage>
                  </div>
                  {/* Input */}
                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-lavender p-3">
                    <Typography
                      size="body"
                      as="span"
                      color="muted"
                      className="flex-1"
                    >
                      Type here...
                    </Typography>
                    <Send className="h-4 w-4 text-coral" />
                  </div>
                </div>
              </Iphone15Pro>
            </div>
          </div>

          {/* Report Phone - Right, tilted */}
          <div className="absolute right-[calc(50%-332px)] translate-x-1/2 rotate-[8deg] opacity-75">
            <div className="h-[560px] w-[275px]">
              <Iphone15Pro>
                <div className="flex h-full flex-col items-center bg-linear-to-br from-lavender to-cream px-6 pt-12">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-coral-20">
                    <FileBarChart
                      className="h-8 w-8 text-coral"
                      strokeWidth={1.5}
                    />
                  </div>
                  <Typography size="h3" className="mb-2">
                    Report
                  </Typography>
                  <Typography
                    size="body"
                    color="muted"
                    align="center"
                    className="mb-6"
                  >
                    Structured insights
                  </Typography>
                  <div className="w-full space-y-3">
                    <div className="rounded-xl bg-white p-3">
                      <Typography size="h4">Primary Symptoms</Typography>
                      <Typography size="body" color="muted">
                        Anxiety, Stress
                      </Typography>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <Typography size="h4">Triggers</Typography>
                      <Typography size="body" color="muted">
                        Work environment
                      </Typography>
                    </div>
                  </div>
                </div>
              </Iphone15Pro>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
