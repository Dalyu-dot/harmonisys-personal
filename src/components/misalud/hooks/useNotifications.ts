// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface AppNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    link?: string | null;
    refId?: string | null;
    refType?: string | null;
    createdAt: string;
}

interface NotificationsResponse {
    notifications: AppNotification[];
    unreadCount: number;
}

const POLL_INTERVAL = 30_000; // 30 s

export function useNotifications() {
    const qc = useQueryClient();

    const query = useQuery<NotificationsResponse>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notifications?limit=20');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            return res.json();
        },
        staleTime: POLL_INTERVAL,
        refetchInterval: POLL_INTERVAL,
        refetchIntervalInBackground: false,
    });

    // Mark a single notification as read
    const markRead = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
        },
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['notifications'] });
            const prev = qc.getQueryData<NotificationsResponse>(['notifications']);
            qc.setQueryData<NotificationsResponse>(['notifications'], (old) => {
                if (!old) return old;
                return {
                    notifications: old.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, old.unreadCount - 1),
                };
            });
            return { prev };
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev);
        },
    });

    // Mark all as read
    const markAllRead = useMutation({
        mutationFn: async () => {
            await fetch('/api/notifications', { method: 'POST' });
        },
        onSuccess: () => {
            qc.setQueryData<NotificationsResponse>(['notifications'], (old) => {
                if (!old) return old;
                return {
                    notifications: old.notifications.map((n) => ({
                        ...n,
                        read: true,
                    })),
                    unreadCount: 0,
                };
            });
        },
    });

    // Delete a single notification
    const deleteNotif = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    });

    return {
        notifications: query.data?.notifications ?? [],
        unreadCount: query.data?.unreadCount ?? 0,
        isLoading: query.isLoading,
        markRead: markRead.mutate,
        markAllRead: markAllRead.mutate,
        deleteNotif: deleteNotif.mutate,
        refetch: query.refetch,
    };
}

// ── Pending-requests-specific hook (for admin / team-leader badge) ─────────────
export function usePendingRequestsCount() {
    return useQuery<{ count: number }>({
        queryKey: ['misalud-pending-count'],
        queryFn: async () => {
            const res = await fetch('/api/misalud/requests?status=PENDING&countOnly=true');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        staleTime: 30_000,
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });
}