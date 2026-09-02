'use client';

import { useAnalytics } from '@/hooks/useEvents';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { STAT_CONFIG } from '@/lib/constants';
import type { AnalyticsData, CategoryBreakdown, EventCountLast24h } from '@/types/event';

export default function AnalyticsCards() {
  const { data: analytics, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 pb-6">
                <div className="h-3 w-28 bg-muted rounded animate-pulse mb-4" />
                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-xs text-muted-foreground">
          Failed to load analytics metrics.
        </CardContent>
      </Card>
    );
  }

  const {
    totalEvents,
    categoryBreakdown = [],
    upcomingCategoryBreakdown = [],
    eventCountsLast24h = [],
  } = analytics;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon, format }) => {
          const rawVal = analytics[key as keyof AnalyticsData] ?? 0;
          const valStr = format ? rawVal.toLocaleString() : String(rawVal);

          return (
            <Card key={key}>
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold tracking-tight mt-2 tabular-nums">{valStr}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4">
        {categoryBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Events by Category</CardTitle>
              <CardDescription className="text-xs">Category distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryBreakdown.map((cat: CategoryBreakdown, i) => {
                const pct = totalEvents > 0 ? Math.round((cat.count / totalEvents) * 100) : 0;
                return (
                  <div key={cat.category || i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{cat.category || 'General'}</span>
                      <span className="text-muted-foreground">{cat.count} — {pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Events in Past 24 Hours by Type</CardTitle>
            <CardDescription className="text-xs">Past event totals grouped by category</CardDescription>
          </CardHeader>
          <CardContent>
            {eventCountsLast24h.length > 0 ? (
              <div className="space-y-2">
                {eventCountsLast24h.map((item: EventCountLast24h, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="font-medium">{item.event_type || 'General'}</span>
                    <span className="bg-muted text-foreground px-2 py-0.5 rounded-md font-semibold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No past events in the last 24 hours.
              </p>
            )}
          </CardContent>
        </Card>

        {upcomingCategoryBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Upcoming Events by Type</CardTitle>
              <CardDescription className="text-xs">Scheduled events grouped by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingCategoryBreakdown.map((item, index) => (
                <div key={item.category || index} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium">{item.category || 'General'}</span>
                  <span className="bg-muted text-foreground px-2 py-0.5 rounded-md font-semibold">
                    {item.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
