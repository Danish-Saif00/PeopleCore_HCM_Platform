const PROFILE_IMAGE_IDS = [5, 11, 12, 13, 14, 32, 44, 45, 47, 48, 49, 52];

export function getProfileImageUrl(seedValue: string, variant = 0): string {
  const hash = Array.from(seedValue).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0
  );
  const imageId = PROFILE_IMAGE_IDS[(hash + variant) % PROFILE_IMAGE_IDS.length];

  return `https://i.pravatar.cc/256?img=${imageId}`;
}
