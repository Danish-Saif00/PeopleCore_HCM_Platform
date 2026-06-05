'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SidePanel } from '@/components/ui/SidePanel';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import { CreateReviewCycleModal } from '@/components/modals/CreateReviewCycleModal';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/formatters';
import { Star, Plus, Clipboard, CheckCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Review, ReviewCycle } from '@/types/peoplecore';
import { Avatar } from '@/components/ui/Avatar';

export default function ReviewsPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reviews' | 'cycles'>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for filling review
  const [overallRating, setOverallRating] = useState(4);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [goals, setGoals] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [session, loading, router]);

  const fetchData = useCallback(async () => {
    if (!session) return;
    setDataLoading(true);
    try {
      const isHR = ['HR Admin', 'Super Admin'].includes(session.role);
      const view = isHR ? 'cycles' : (session.role === 'Manager' ? 'reviewer' : 'mine');
      
      const res = await fetch(`/api/reviews?view=${view}`);
      const json = await res.json();
      if (json.success) {
        if (isHR) {
          setCycles(json.data);
          setActiveTab('cycles');
        } else {
          setReviews(json.data);
          setActiveTab('reviews');
        }
      }

      // Admin review tables are company-wide rather than limited to the signed-in reviewer.
      if (isHR) {
        const revRes = await fetch('/api/reviews?view=all');
        const revJson = await revRes.json();
        if (revJson.success) {
          setReviews(revJson.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch performance reviews:', err);
    } finally {
      setDataLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleOpenReview = (rev: any) => {
    setSelectedReview(rev);
    if (rev.status === 'Pending' && rev.reviewerId === session?.employeeId) {
      setIsEditing(true);
      setOverallRating(rev.ratings?.overall ?? 4);
      setStrengths(rev.strengths ?? '');
      setImprovements(rev.areasOfImprovement ?? '');
      setGoals(rev.goals ?? '');
      setComment(rev.comment ?? '');
    } else {
      setIsEditing(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReview) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit-review',
          reviewId: selectedReview.id,
          ratings: { overall: overallRating },
          strengths,
          areasOfImprovement: improvements,
          goals,
          comment,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedReview(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to submit performance review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <div
            className="w-8 h-8 rounded-full border-t-transparent"
            style={{
              animation: 'spin var(--motion-loading-spin) linear infinite',
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: 'var(--primary)',
              borderTopColor: 'transparent',
            }}
          />
        </div>
      </AppShell>
    );
  }

  const isHR = ['HR Admin', 'Super Admin'].includes(session.role);

  return (
    <AppShell>
      <PageHeader
        title="Performance Reviews"
        subtitle={isHR ? "Initiate and track performance review cycles." : "Complete self-evaluations or read your completed manager reviews."}
        action={
          isHR ? (
            <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)} id="create-review-cycle">
              New Cycle
            </Button>
          ) : undefined
        }
      />

      {isHR && (
        <div className="mb-4">
          <Tabs
            tabs={[
              { id: 'cycles', label: 'Review Cycles' },
              { id: 'reviews', label: 'All Reviews' },
            ]}
            activeTab={activeTab}
            onChange={(tabId: string) => setActiveTab(tabId as 'reviews' | 'cycles')}
          />
        </div>
      )}

      {activeTab === 'cycles' && isHR && (
        <div className="pc-card overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Cycle Name',
                render: (row: ReviewCycle) => (
                  <span className="font-semibold text-[color:var(--foreground)]">{row.name}</span>
                ),
              },
              {
                key: 'period',
                header: 'Review Period',
              },
              {
                key: 'status',
                header: 'Status',
                render: (row: ReviewCycle) => <StatusBadge status={row.status} />,
              },
              {
                key: 'progress',
                header: 'Completion',
                render: (row: any) => {
                  const total = row.reviews?.length ?? 0;
                  const completed = row.reviews?.filter((r: any) => r.status === 'Completed').length ?? 0;
                  return `${completed} of ${total} completed`;
                },
              },
            ]}
            data={cycles as any}
            loading={dataLoading}
            emptyTitle="No review cycles found"
            emptyDescription="Start a new performance review cycle."
          />
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="pc-card overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'period',
                header: 'Period',
                render: (row: any) => (
                  <span className="font-semibold text-[color:var(--foreground)]">{row.period}</span>
                ),
              },
              {
                key: 'employee',
                header: 'Employee',
                render: (row: any) => (
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={row.employee?.fullName ?? session.fullName ?? 'Me'}
                      avatarUrl={row.employee?.avatarUrl ?? session.avatarUrl}
                      size="sm"
                    />
                    <span>{row.employee?.fullName ?? session.fullName ?? 'Me'}</span>
                  </div>
                ),
              },
              {
                key: 'reviewer',
                header: 'Reviewer',
                render: (row: any) => (
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={row.reviewer?.fullName ?? 'Manager'}
                      avatarUrl={row.reviewer?.avatarUrl}
                      size="sm"
                    />
                    <span>{row.reviewer?.fullName ?? 'Manager'}</span>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row: any) => <StatusBadge status={row.status} />,
              },
              {
                key: 'rating',
                header: 'Rating',
                render: (row: any) => (row.ratings?.overall ? `${row.ratings.overall} / 5 ★` : '—'),
              },
              {
                key: 'action',
                header: '',
                render: (row: any) => {
                  const canComplete = row.status === 'Pending' && row.reviewerId === session.employeeId;
                  return (
                    <Button size="sm" variant={canComplete ? 'primary' : 'ghost'} onClick={(e) => { e.stopPropagation(); handleOpenReview(row); }}>
                      {canComplete ? 'Complete' : 'View'}
                    </Button>
                  );
                },
              },
            ]}
            data={reviews as any}
            loading={dataLoading}
            onRowClick={(row) => handleOpenReview(row)}
            emptyTitle="No reviews found"
            emptyDescription="Your performance reviews will show up here."
          />
        </div>
      )}

      {/* Review Dialog/Side Panel */}
      {selectedReview && (
        <SidePanel
          open={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          title={isEditing ? 'Complete Performance Review' : 'Performance Review Details'}
          subtitle={selectedReview.period}
          footer={
            isEditing ? (
              <div className="flex gap-2 w-full">
                <Button variant="ghost" onClick={() => setSelectedReview(null)} disabled={submitting} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} loading={submitting} className="flex-1" id="submit-review-form">
                  Submit Review
                </Button>
              </div>
            ) : undefined
          }
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'var(--muted)' }}>
              <Avatar
                name={selectedReview.employee?.fullName ?? session.fullName ?? 'Self'}
                avatarUrl={selectedReview.employee?.avatarUrl ?? session.avatarUrl}
                size="md"
              />
              <div>
                <p className="text-xs text-[color:var(--muted-foreground)] uppercase tracking-wider font-semibold">
                  Subject
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  {selectedReview.employee?.fullName ?? session.fullName ?? 'Self'}
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                  Reviewed by: {selectedReview.reviewer?.fullName ?? 'Manager'}
                </p>
              </div>
            </div>

            {isEditing ? (
              // Fill-in Form (For reviewer)
              <div className="space-y-4">
                <div>
                  <label className="form-label mb-2">Overall Rating: {overallRating} / 5</label>
                  <div className="flex gap-1.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setOverallRating(val)}
                        className="p-1 rounded-md hover:bg-[color:var(--muted)] transition-colors text-2xl"
                      >
                        <span style={{ color: val <= overallRating ? 'var(--warning)' : 'var(--border)' }}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Strengths"
                  placeholder="What did this employee excel at this quarter?"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                />

                <Textarea
                  label="Areas of Improvement"
                  placeholder="Where can they improve or develop?"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                />

                <Textarea
                  label="Goals for Next Period"
                  placeholder="What objectives should they hit next quarter?"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />

                <Textarea
                  label="Additional Comments (optional)"
                  placeholder="Add any summary or thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            ) : (
              // Read-only Details (For employee or when completed)
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                    Overall Rating
                  </p>
                  {selectedReview.ratings?.overall ? (
                    <div className="flex gap-0.5 mt-1 text-xl text-[color:var(--warning)]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < selectedReview.ratings.overall ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="text-sm font-semibold text-[color:var(--foreground)] ml-2 mt-0.5">
                        ({selectedReview.ratings.overall} / 5)
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm font-medium mt-1">Pending rating</p>
                  )}
                </div>

                {selectedReview.status === 'Completed' ? (
                  <>
                    <div className="pt-2 border-t border-[color:var(--border)]">
                      <p className="text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                        Strengths
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReview.strengths}</p>
                    </div>

                    <div className="pt-2 border-t border-[color:var(--border)]">
                      <p className="text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                        Areas of Improvement
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedReview.areasOfImprovement}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[color:var(--border)]">
                      <p className="text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                        Goals
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReview.goals}</p>
                    </div>

                    {selectedReview.comment && (
                      <div className="pt-2 border-t border-[color:var(--border)]">
                        <p className="text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                          Reviewer Comments
                        </p>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReview.comment}</p>
                      </div>
                    )}

                    {selectedReview.submittedAt && (
                      <p className="text-xs text-[color:var(--muted-foreground)] italic pt-4">
                        Submitted on {formatDate(selectedReview.submittedAt)}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="pc-card p-4 text-center border-dashed text-[color:var(--muted-foreground)]">
                    This review is pending completion by the reviewer.
                  </div>
                )}
              </div>
            )}
          </div>
        </SidePanel>
      )}

      <CreateReviewCycleModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchData}
      />
    </AppShell>
  );
}
