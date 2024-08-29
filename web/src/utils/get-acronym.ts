export function getAcronym(value: string): string {
  const acronymString = value
    .split(' ')
    .map((word) => word.slice(0, 1))
    .join('')
    .toUpperCase();

  return acronymString;
}