import { t } from 'i18next';
import { Button } from 'react-bootstrap';
import { diffTime } from 'web-utility';

import { Activity } from '../../models/Activity';
import { TimeUnit } from '../../utils/time';

export type ActivityStatusTextProps = Pick<
  Activity,
  | 'status'
  | 'enrollmentStartedAt'
  | 'enrollmentEndedAt'
  | 'eventStartedAt'
  | 'eventEndedAt'
  | 'judgeStartedAt'
  | 'judgeEndedAt'
>;

export const getActivityStatusText = ({
  status,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
}: ActivityStatusTextProps) => {
  const now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    eventStart = new Date(eventStartedAt),
    eventEnd = new Date(eventEndedAt),
    judgeStart = new Date(judgeStartedAt),
    judgeEnd = new Date(judgeEndedAt),
    enrollmentDiff = diffTime(enrollmentStart, new Date(), TimeUnit);

  return !isOnline
    ? t('pending_review')
    : now < +enrollmentStart
    ? t('register_after', {
        distance: enrollmentDiff.distance,
        unit: enrollmentDiff.unit,
      })
    : now < +enrollmentEnd
    ? t('enrolling')
    : now < +eventStart
    ? t('registration_deadline')
    : now < +eventEnd
    ? t('in_progress')
    : now < +judgeStart
    ? t('submit_work_deadline')
    : now < +judgeEnd
    ? t('judges_review')
    : t('competition_over');
};
export interface ActivityEntryProps extends ActivityStatusTextProps {
  href: string;
}

export function ActivityEntry({
  status,
  enrollmentStartedAt,
  enrollmentEndedAt,
  eventStartedAt,
  eventEndedAt,
  judgeStartedAt,
  judgeEndedAt,
  href,
}: ActivityEntryProps) {
  const now = Date.now(),
    isOnline = status === 'online',
    enrollmentStart = new Date(enrollmentStartedAt),
    enrollmentEnd = new Date(enrollmentEndedAt),
    enrolling = isOnline && +enrollmentStart < now && now < +enrollmentEnd;

  return (
    <Button
      className="my-2 w-100"
      variant="primary"
      href={href}
      disabled={!enrolling}
    >
      {getActivityStatusText({
        status,
        enrollmentStartedAt,
        enrollmentEndedAt,
        eventStartedAt,
        eventEndedAt,
        judgeStartedAt,
        judgeEndedAt,
      })}
    </Button>
  );
}
