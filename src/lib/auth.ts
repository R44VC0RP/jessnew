export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(email);
} 