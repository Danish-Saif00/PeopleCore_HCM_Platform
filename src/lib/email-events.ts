import { db, generateId } from '@/data/mock-db';
import type { EmailEvent, EmailEventType } from '@/types/peoplecore';

export function logMockEmail(to: string, type: EmailEventType, subject: string, body: string): EmailEvent {
  return db.addEmailEvent({
    id: generateId('email'),
    to,
    type,
    subject,
    body,
    sentAt: new Date().toISOString(),
    status: 'sent',
  });
}
