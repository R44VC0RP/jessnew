// Function to check if an email is an admin email
export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(email);
};