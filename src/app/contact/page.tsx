'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { submitContactForm } from '../actions/contact';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [userType, setUserType] = useState<'solo' | 'team' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      toast.error('Please select if you are a solo creator or part of a team');
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await submitContactForm({ ...formData, userType });
      if (result.success) {
        toast.success(result.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
        setUserType(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="grid lg:grid-cols-2 h-full">
        {/* Form Section */}
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-16 lg:py-24 lg:px-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--accent-light)] dark:text-[var(--accent-dark)]">
                Get in touch
              </h1>
              <p className="mt-2 text-base text-[#4C4C4C] dark:text-[#F5F5F5]">
                Our team would love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4C4C4C] dark:text-[#F5F5F5] mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[var(--accent-light)] dark:focus:ring-[var(--accent-dark)] text-[#4C4C4C] dark:text-[#F5F5F5]"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4C4C4C] dark:text-[#F5F5F5] mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Last name"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[var(--accent-light)] dark:focus:ring-[var(--accent-dark)] text-[#4C4C4C] dark:text-[#F5F5F5]"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4C4C4C] dark:text-[#F5F5F5] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[var(--accent-light)] dark:focus:ring-[var(--accent-dark)] text-[#4C4C4C] dark:text-[#F5F5F5]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4C4C4C] dark:text-[#F5F5F5] mb-1">
                  Phone number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-[#E5E7EB] dark:border-[#2D2D2D] bg-gray-50 dark:bg-[#1A1A1A] text-[#4C4C4C] dark:text-[#F5F5F5] text-sm">
                    US
                  </span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="flex-1 px-3 py-2 rounded-r-md bg-white dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[var(--accent-light)] dark:focus:ring-[var(--accent-dark)] text-[#4C4C4C] dark:text-[#F5F5F5]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('solo')}
                  className={`relative p-4 rounded-xl border ${
                    userType === 'solo'
                      ? 'border-[var(--accent-light)] dark:border-[var(--accent-dark)] bg-[var(--accent-light)]/5 dark:bg-[var(--accent-dark)]/5'
                      : 'border-[#E5E7EB] dark:border-[#2D2D2D]'
                  } text-left hover:border-[var(--accent-light)] dark:hover:border-[var(--accent-dark)] transition-colors`}
                >
                  {userType === 'solo' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)]/10 dark:bg-[var(--accent-dark)]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--accent-light)] dark:text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                    <p className="font-medium text-[#4C4C4C] dark:text-[#F5F5F5]">I need freelance work done</p>
                    <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">I am looking to hire you for a one off project or short term work.</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('team')}
                  className={`relative p-4 rounded-xl border ${
                    userType === 'team'
                      ? 'border-[var(--accent-light)] dark:border-[var(--accent-dark)] bg-[var(--accent-light)]/5 dark:bg-[var(--accent-dark)]/5'
                      : 'border-[#E5E7EB] dark:border-[#2D2D2D]'
                  } text-left hover:border-[var(--accent-light)] dark:hover:border-[var(--accent-dark)] transition-colors`}
                >
                  {userType === 'team' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)]/10 dark:bg-[var(--accent-dark)]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--accent-light)] dark:text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                    <p className="font-medium text-[#4C4C4C] dark:text-[#F5F5F5]">I am apart of a company</p>
                    <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">I am looking to hire you for a long term project or ongoing work.</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                You agree to our{' '}
                <Link href="/privacy" className="text-[var(--accent-light)] dark:text-[var(--accent-dark)] hover:underline">
                  privacy policy
                </Link>
                .
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !userType}
                className="w-full px-4 py-3 rounded-md bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Get in touch'}
              </button>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block relative rounded-2xl overflow-hidden mt-4 w-[90%]">
          <Image
            src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Scenic mountain lake landscape"
            fill
            className="object-cover "
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
          
          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p className="text-lg font-medium mb-2 leading-relaxed">
              Jessica's eye for design and attention to detail is exceptional. Her ability to create intuitive and visually stunning interfaces has transformed our digital presence. She truly understands how to blend aesthetics with functionality.
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">— Ryan Vogel</span>
                <span className="text-white/80">Chief Design Officer, Exon Enterprise</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 