import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, User, AtSign, Mail, Phone, Globe, Building2, MapPin, Save, UserPlus, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isValidEmail } from '../utils/helpers';
import { ButtonSpinner } from './Loader';

/* ── Animation Variants ────────────────────────────────────────── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 26, stiffness: 360 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.15 },
  },
};

/* ── Field config ──────────────────────────────────────────────── */
const FIELDS = [
  {
    section: 'Personal Identity',
    fields: [
      { id: 'name',     label: 'Full Name',   icon: User,      type: 'text',  required: true  },
      { id: 'username', label: 'Username',     icon: AtSign,    type: 'text',  required: true  },
      { id: 'email',    label: 'Email',        icon: Mail,      type: 'email', required: true  },
      { id: 'phone',    label: 'Phone',        icon: Phone,     type: 'text',  required: true  },
    ],
  },
  {
    section: 'Organization & Network',
    fields: [
      { id: 'companyName', label: 'Company Name', icon: Building2, type: 'text', required: true  },
      { id: 'website',     label: 'Website',      icon: Globe,     type: 'text', required: false },
    ],
  },
  {
    section: 'Location',
    fields: [
      { id: 'street', label: 'Street', icon: MapPin, type: 'text', required: false },
      { id: 'city',   label: 'City',   icon: MapPin, type: 'text', required: false },
    ],
  },
];

const EMPTY = { name:'', username:'', email:'', phone:'', website:'', companyName:'', city:'', street:'' };

const toForm = (user) => user ? ({
  name:        user.name       ?? '',
  username:    user.username   ?? '',
  email:       user.email      ?? '',
  phone:       user.phone      ?? '',
  website:     user.website    ?? '',
  companyName: user.company?.name    ?? '',
  city:        user.address?.city    ?? '',
  street:      user.address?.street  ?? '',
}) : EMPTY;

const toPayload = (f) => ({
  name: f.name,
  username: f.username,
  email: f.email,
  phone: f.phone,
  website: f.website,
  company: { name: f.companyName },
  address: { city: f.city, street: f.street },
});

const validate = (values) => {
  const e = {};
  if (!values.name.trim())        e.name        = 'Full name is required.';
  if (!values.username.trim())    e.username    = 'Username is required.';
  if (!values.email.trim())       e.email       = 'Email is required.';
  else if (!isValidEmail(values.email)) e.email = 'Enter a valid email address.';
  if (!values.phone.trim())       e.phone       = 'Phone is required.';
  if (!values.companyName.trim()) e.companyName = 'Company name is required.';
  return e;
};

/**
 * UserForm — Dynamic Themed Animated User Modal.
 */
const UserForm = ({ user, onSubmit, onClose, isSubmitting }) => {
  const { activePreset } = useTheme();
  const isEdit = Boolean(user);
  const [form, setForm]       = useState(toForm(user));
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(toForm(user));
    setErrors({});
    setTouched({});
  }, [user]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({
      ...p,
      [name]: validate({ ...form, [name]: value })[name],
    }));
  }, [form]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(form)[name] }));
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(toPayload(form));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        className="relative z-10 bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/90 font-mono"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-zinc-850 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-inner transition-colors"
              style={{
                backgroundColor: `rgba(${activePreset.rgb}, 0.15)`,
                border: `1px solid ${activePreset.hex}60`,
                color: activePreset.hex,
              }}
            >
              {isEdit ? <User size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 id="form-modal-title" className="text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-wide">
                {isEdit ? `[EDIT_USER] ${user.name}` : '[REGISTER_NEW_USER]'}
              </h2>
              <p className="text-[11px] text-zinc-500 font-sans">
                {isEdit ? 'Modify active profile database entry' : 'Input identity parameters to deploy record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-6 font-sans">
          {FIELDS.map(({ section, fields }) => (
            <div key={section} className="flex flex-col gap-3">
              <h3
                className="font-mono text-[11px] font-bold uppercase tracking-wider border-b border-zinc-900 pb-1.5 transition-colors"
                style={{ color: activePreset.hex }}
              >
                // {section}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {fields.map(({ id, label, icon: Icon, type, required }) => {
                  const hasError = errors[id] && touched[id];
                  return (
                    <div key={id} className="flex flex-col gap-1">
                      <label htmlFor={id} className="font-mono text-[11px] text-zinc-400 flex items-center gap-1">
                        {label}
                        {required && <span className="text-red-400">*</span>}
                      </label>
                      <div className="relative">
                        <Icon
                          size={14}
                          className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                            hasError ? 'text-red-400' : 'text-zinc-500'
                          }`}
                          aria-hidden="true"
                        />
                        <input
                          id={id}
                          name={id}
                          type={type}
                          value={form[id]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          className={`w-full pl-9 pr-3 py-2 font-mono text-xs rounded-lg bg-zinc-900/90 text-zinc-100 placeholder-zinc-600 border transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                            hasError
                              ? 'border-red-600 focus:ring-1 focus:ring-red-600/50'
                              : 'border-zinc-850 focus:border-zinc-700'
                          }`}
                          style={
                            !hasError
                              ? {
                                  ':focus': {
                                    borderColor: activePreset.hex,
                                  },
                                }
                              : undefined
                          }
                        />
                      </div>
                      {hasError && (
                        <p className="flex items-center gap-1 font-mono text-[10px] text-red-400 mt-0.5">
                          <AlertCircle size={11} className="shrink-0" />
                          <span>{errors[id]}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 font-mono">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              [CANCEL]
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase rounded-lg text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg"
              style={{
                backgroundColor: activePreset.hex,
                boxShadow: `0 0 14px ${activePreset.glow}`,
              }}
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  <span>COMMITTING...</span>
                </>
              ) : isEdit ? (
                <>
                  <Save size={14} />
                  <span>[SAVE_CHANGES]</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>[CREATE_RECORD]</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserForm;
