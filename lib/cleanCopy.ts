export function cleanCopy(value: string) {
  return value
    .replaceAll("â€™", "'")
    .replaceAll("â€”", "—")
    .replaceAll("â€œ", '"')
    .replaceAll("â€", '"');
}
