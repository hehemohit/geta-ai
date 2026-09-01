import React, { useState, useEffect, useCallback } from 'react';
import { X, User, AtSign, Mail, Phone, Globe, Building2, MapPin, Save, UserPlus, AlertCircle } from 'lucide-react';
import { isValidEmail } from '../utils/helpers';
import { ButtonSpinner } from './Loader';

/* ── Field config ──────────────────────────────────────────────── */
const FIELDS = [
  {
    section: 'Personal Information',
    fields: [
      { id: 'name',     label: 'Full Name',   icon: User,      type: 'text',  required: true  },
      { id: 'username', label: 'Username',     icon: AtSign,    type: 'text',  required: true  },
      { id: 'email',    label: 'Email',        icon: Mail,      type: 'email', required: true  },
      { id: 'phone',    label: 'Phone',        icon: Phone,     type: 'text',  required: true  },
    ],
  },
  {
    section: 'Company & Web',
    fields: [
      { id: 'companyName', label: 'Company Name', icon: Building2, type: 'text', required: true  },
      { id: 'website',     label: 'Website',      icon: Globe,     type: 'text', required: false },
    ],
  },
  {
    section: 'Address',
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
 * UserForm — accessible modal with keyboard escape handling and validation.
 */
const UserForm = ({ user, onSubmit, onClose, isSubmitting }) => {
  const isEdit = Boolean(user);
  const [form, setForm]       = useState(toForm(user));
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(toForm(user));
    setErrors({});
    setTouched({});
  }, [user]);

  // Escape key listener for modal accessibility
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        className="bg-gray-900 border border-gray-800 relative rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-gray-800 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              {isEdit ? <User size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 id="form-modal-title" className="text-base font-bold text-gray-100">
                {isEdit ? `Edit ${user.name}` : 'Add New User'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEdit ? 'Update user profile and contact details' : 'Fill in the fields below to register a new user'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-6">
          {FIELDS.map(({ section, fields }) => (
            <div key={section} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
                {section}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ id, label, icon: Icon, type, required }) => {
                  const hasError = errors[id] && touched[id];
                  return (
                    <div key={id} className="flex flex-col gap-1.5">
                      <label htmlFor={id} className="text-xs font-medium text-gray-300 flex items-center gap-1">
                        {label}
                        {required && <span className="text-rose-400">*</span>}
                      </label>
                      <div className="relative">
                        <Icon
                          size={15}
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                            hasError ? 'text-rose-400' : 'text-gray-400'
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
                          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-950 text-gray-100 placeholder-gray-600 border transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            hasError
                              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                              : 'border-gray-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      {hasError && (
                        <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-0.5">
                          <AlertCircle size={12} className="shrink-0" />
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
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  <span>Saving...</span>
                </>
              ) : isEdit ? (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
