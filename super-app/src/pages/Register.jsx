import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

// ── Reusable Input Field ──────────────────────────────────────────────────────
const Field = ({ name, type = 'text', placeholder, value, onChange, error }) => (
  <div className="flex flex-col gap-1">
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="off"
      className={`w-full bg-[#292929] text-white p-4 rounded-md outline-none
        placeholder-[#7C7C7C] transition-all duration-200
        ${error ? 'border border-[#FF0000]' : 'border border-transparent focus:border-[#72DB73]'}`}
    />
    {error && (
      <span className="text-[#FF0000] text-sm pl-1">{error}</span>
    )}
  </div>
);

// ── Register Page ─────────────────────────────────────────────────────────────
export default function Register() {
  const setUser  = useStore(s => s.setUser);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', username: '', email: '', mobile: '', terms: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear error for field as user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                   e.name     = 'Field is required';
    if (!form.username.trim())                               e.username = 'Field is required';
    if (!form.email.trim())                                  e.email    = 'Field is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email   = 'Invalid email format';
    if (!form.mobile.trim())                                 e.mobile   = 'Field is required';
    else if (!/^\d{10}$/.test(form.mobile))                  e.mobile   = 'Must be exactly 10 digits';
    if (!form.terms)                                         e.terms    = 'You must check this box to proceed';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setUser({
      name:     form.name,
      username: form.username,
      email:    form.email,
      mobile:   form.mobile,
    });
    navigate('/categories');
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">

      {/* ── Left Pane — Hero image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative border-r-2 border-[#FF5209]">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop"
          alt="DJ Concert"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Bottom text */}
        <div className="absolute bottom-16 left-12 text-white z-10 pr-8">
          <h1 className="text-[3.4rem] font-black tracking-wide leading-tight drop-shadow-2xl">
            Discover new things on<br />Superapp
          </h1>
        </div>
      </div>

      {/* ── Right Pane — Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 lg:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          {/* Logo */}
          <h2
            className="text-center text-5xl mb-3"
            style={{ fontFamily: 'Pacifico, cursive', color: '#72DB73' }}
          >
            Super app
          </h2>
          <p className="text-center text-white mb-10 text-lg font-medium">
            Create your new account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Field
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              name="username"
              placeholder="UserName"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Field
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              name="mobile"
              placeholder="Mobile"
              value={form.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />

            {/* Checkbox */}
            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer">
                <input
                  id="terms"
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer accent-[#72DB73] bg-[#292929] rounded"
                />
                <span className="text-[#7C7C7C] text-sm">
                  Share my registration data with Superapp
                </span>
              </label>
              {errors.terms && (
                <span className="text-[#FF0000] text-sm pl-8">{errors.terms}</span>
              )}
            </div>

            {/* Submit button */}
            <button
              id="signup-btn"
              type="submit"
              className="w-full bg-[#72DB73] hover:bg-[#5bbc5c] text-white font-bold text-xl
                py-3.5 rounded-full mt-4 tracking-widest transition-colors duration-200 shadow-lg"
            >
              SIGN UP
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-8 text-sm text-[#7C7C7C] leading-relaxed space-y-2">
            <p>
              By clicking on Sign up. you agree to Superapp{' '}
              <span className="text-[#72DB73] cursor-pointer font-medium hover:underline">
                Terms and Conditions of Use
              </span>
            </p>
            <p>
              To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp{' '}
              <span className="text-[#72DB73] cursor-pointer font-medium hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
