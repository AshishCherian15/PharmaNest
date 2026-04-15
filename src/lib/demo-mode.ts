export function isDemoModeEnabled(): boolean {
  const value =
    process.env.NEXT_PUBLIC_DEMO_MODE ??
    process.env.DEMO_MODE ??
    '';

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}
