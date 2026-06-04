import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

import darkHorizontalLong from '@/assets/peoplecore_logo_kit/peoplecore-logo-dark-horizontal-long.png';
import darkHorizontalShort from '@/assets/peoplecore_logo_kit/peoplecore-logo-dark-horizontal-short.png';
import darkMarkOnly from '@/assets/peoplecore_logo_kit/peoplecore-logo-dark-mark-only.png';
import darkVerticalLong from '@/assets/peoplecore_logo_kit/peoplecore-logo-dark-vertical-long.png';
import darkVerticalShort from '@/assets/peoplecore_logo_kit/peoplecore-logo-dark-vertical-short.png';
import lightHorizontalLong from '@/assets/peoplecore_logo_kit/peoplecore-logo-light-horizontal-long.png';
import lightHorizontalShort from '@/assets/peoplecore_logo_kit/peoplecore-logo-light-horizontal-short.png';
import lightMarkOnly from '@/assets/peoplecore_logo_kit/peoplecore-logo-light-mark-only.png';
import lightVerticalLong from '@/assets/peoplecore_logo_kit/peoplecore-logo-light-vertical-long.png';
import lightVerticalShort from '@/assets/peoplecore_logo_kit/peoplecore-logo-light-vertical-short.png';

export type LogoTone = 'light' | 'dark';
export type LogoLockup = 'horizontal' | 'vertical' | 'mark';
export type LogoLength = 'long' | 'short';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LogoVariant =
  | 'light-horizontal-long'
  | 'light-horizontal-short'
  | 'light-vertical-long'
  | 'light-vertical-short'
  | 'light-mark-only'
  | 'dark-horizontal-long'
  | 'dark-horizontal-short'
  | 'dark-vertical-long'
  | 'dark-vertical-short'
  | 'dark-mark-only';

interface LogoProps {
  alt?: string;
  className?: string;
  imageClassName?: string;
  length?: LogoLength;
  lockup?: LogoLockup;
  priority?: boolean;
  size?: LogoSize;
  tone?: LogoTone;
  variant?: LogoVariant;
}

const LOGO_ASSETS: Record<LogoVariant, StaticImageData> = {
  'light-horizontal-long': lightHorizontalLong,
  'light-horizontal-short': lightHorizontalShort,
  'light-vertical-long': lightVerticalLong,
  'light-vertical-short': lightVerticalShort,
  'light-mark-only': lightMarkOnly,
  'dark-horizontal-long': darkHorizontalLong,
  'dark-horizontal-short': darkHorizontalShort,
  'dark-vertical-long': darkVerticalLong,
  'dark-vertical-short': darkVerticalShort,
  'dark-mark-only': darkMarkOnly,
};

const SIZE_CLASSES: Record<LogoLockup, Record<LogoSize, string>> = {
  horizontal: {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  },
  vertical: {
    xs: 'h-14 w-auto',
    sm: 'h-20 w-auto',
    md: 'h-28 w-auto',
    lg: 'h-36 w-auto',
    xl: 'h-44 w-auto',
  },
  mark: {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  },
};

function getVariant(
  variant: LogoVariant | undefined,
  tone: LogoTone,
  lockup: LogoLockup,
  length: LogoLength
): LogoVariant {
  if (variant) return variant;
  if (lockup === 'mark') return `${tone}-mark-only` as LogoVariant;
  return `${tone}-${lockup}-${length}` as LogoVariant;
}

function getLockup(variant: LogoVariant, lockup: LogoLockup): LogoLockup {
  if (variant.includes('mark-only')) return 'mark';
  if (variant.includes('vertical')) return 'vertical';
  if (variant.includes('horizontal')) return 'horizontal';
  return lockup;
}

export function Logo({
  alt = 'PeopleCore',
  className,
  imageClassName,
  length = 'short',
  lockup = 'horizontal',
  priority = false,
  size = 'md',
  tone = 'light',
  variant,
}: LogoProps) {
  const resolvedVariant = getVariant(variant, tone, lockup, length);
  const resolvedLockup = getLockup(resolvedVariant, lockup);

  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>
      <Image
        src={LOGO_ASSETS[resolvedVariant]}
        alt={alt}
        priority={priority}
        className={cn('block object-contain', SIZE_CLASSES[resolvedLockup][size], imageClassName)}
      />
    </span>
  );
}
