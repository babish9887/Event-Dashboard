'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnalyticsCards from '@/components/AnalyticsCards';
import ActivityFeed from '@/components/ActivityFeed';
import CreateEventModal from '@/components/CreateEventModal';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onOpenCreateModal={() => setIsModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold">Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregate metrics, Auto refresh every 5 seconds
            </p>
          </div>
          <AnalyticsCards />
        </section>

        <Separator />

        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold">Events</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filter by Category and Date Range
            </p>
          </div>
          <ActivityFeed />
        </section>
      </main>

      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
