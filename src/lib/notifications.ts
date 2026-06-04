import { db, generateId } from '@/data/mock-db';
import type { Notification, NotificationType } from '@/types/peoplecore';

export function getNotifications(userId: string): Notification[] {
  return db.getNotificationsByUser(userId);
}

export function getUnreadCount(userId: string): number {
  return db.getNotificationsByUser(userId).filter((n) => !n.read).length;
}

export function markAllRead(userId: string): void {
  db.markAllNotificationsRead(userId);
}

export function markRead(notifId: string): void {
  db.markNotificationRead(notifId);
}

export interface CreateNotificationInput {
  userId: string;
  employeeId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export function createNotification(
  input: CreateNotificationInput
): Notification {
  const notif: Notification = {
    id: generateId('notif'),
    ...input,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.addNotification(notif);
  return notif;
}
