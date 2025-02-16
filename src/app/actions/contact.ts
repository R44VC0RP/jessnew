'use server';

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  userType: 'solo' | 'team';
};

export async function submitContactForm(data: ContactForm) {
  try {
    // TODO: Implement your email service here
    // For now, we'll just log the data
    console.log('Form submission:', data);
    
    return {
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.'
    };
  }
} 