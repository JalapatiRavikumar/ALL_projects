'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSuperStore } from '@/store/useSuperStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { UserProfile } from '@/types';

// ─── Validation ───────────────────────────────────────────────────────────────
interface FormValues {
  name: string;
  username: string;
  email: string;
  mobile: string;
  terms: boolean;
}
type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(form: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim())                                    errors.name     = 'Name is required';
  if (!form.username.trim())                                errors.username = 'Username is required';
  if (!form.email.trim())                                   errors.email    = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email    = 'Enter a valid email address';
  if (!form.mobile.trim())                                  errors.mobile   = 'Mobile is required';
  else if (!/^\d{10}$/.test(form.mobile))                   errors.mobile   = 'Mobile must be exactly 10 digits';
  if (!form.terms)                                          errors.terms    = 'You must agree to continue';
  return errors;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router  = useRouter();
  const setUser = useSuperStore((s) => s.setUser);

  const [form, setForm]     = useState<FormValues>({ name: '', username: '', email: '', mobile: '', terms: false });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear field error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const profile: UserProfile = {
      name:         form.name,
      username:     form.username,
      email:        form.email,
      mobile:       form.mobile,
      isRegistered: true,
    };
    setUser(profile);
    router.push('/onboarding');
  };

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">

      {/* ── Left — Hero image ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative border-r-2 border-[#FF5209]">
        <Image
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop"
          alt="DJ Concert — Discover new things on Superapp"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Headline */}
        <div className="absolute bottom-16 left-12 z-10 pr-10">
          <h1 className="text-[3.2rem] font-black leading-tight text-white drop-shadow-2xl">
            Discover new things<br />on Superapp
          </h1>
        </div>
      </div>

      {/* ── Right — Registration form ─────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 lg:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          {/* Logo */}
          <p
            className="text-center text-5xl mb-2 font-pacifico"
            style={{ color: '#72DB73' }}
          >
            Super app
          </p>
          <p className="text-center text-white mb-10 text-base">Create your new account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              id="name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              id="username"
              name="username"
              placeholder="UserName"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="Mobile"
              value={form.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />

            {/* Checkbox */}
            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#72DB73] cursor-pointer rounded"
                />
                <span className="text-[#7C7C7C] text-sm">Share my registration data with Superapp</span>
              </label>
              {errors.terms && (
                <span role="alert" className="text-red-500 text-sm pl-7">⚠ {errors.terms}</span>
              )}
            </div>

            {/* Submit */}
            <Button
              id="signup-btn"
              type="submit"
              size="lg"
              fullWidth
              className="mt-2 tracking-[0.2em]"
            >
              SIGN UP
            </Button>
          </form>

          {/* Footer copy */}
          <div className="mt-8 text-[#7C7C7C] text-xs leading-6 space-y-2">
            <p>
              By clicking on Sign up, you agree to Superapp{' '}
              <span className="text-[#72DB73] cursor-pointer hover:underline font-medium">
                Terms and Conditions of Use
              </span>
            </p>
            <p>
              To learn more about how Superapp collects, uses, shares and protects your personal data please read Superapp{' '}
              <span className="text-[#72DB73] cursor-pointer hover:underline font-medium">
                Privacy Policy
              </span>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
