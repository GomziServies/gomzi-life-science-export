import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { Eyebrow } from './SectionHeading';
import { countries } from '../data/countries';
import { submitInquiry } from '../services/inquiry';

const emptyForm = { name: '', phone: '', email: '', company: '', country: '', city: '', message: '' };

// Same fields as the side contact form and the Contact page form.
export default function InquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const change = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      await submitInquiry({ form: 'popup-form', ...form });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your enquiry could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const reset = () => { setForm(emptyForm); setError(''); setSubmitted(false); };
  const close = () => { onClose(); reset(); };

  return <Modal open={open} onClose={close} labelledBy="inquiry-title" className="inquiry-modal">
    <Eyebrow>Let’s build something meaningful</Eyebrow>
    <h2 id="inquiry-title">Your next chapter<br />starts here.</h2>
    {submitted ? <div className="draft-panel">
      <p className="draft-ready"><CheckCircle2 size={18} />Thank you, {form.name || 'Partner'}!</p>
      <p className="modal-intro">Your enquiry for <strong>{form.company || 'your brand'}</strong> has been received. Our team will reach out to you shortly.</p>
      <button className="button" type="button" onClick={reset}>Submit another enquiry<ArrowRight size={18} /></button>
    </div> : <>
      <p className="modal-intro">Tell us a little about your ambition. Our team will get back to you shortly.</p>
      <form onSubmit={submit} className="inquiry-form">
        <div className="form-row">
          <label>Name <span>*</span><input name="name" value={form.name} onChange={change} autoComplete="name" required maxLength={100} placeholder="Full name" /></label>
          <label>Phone <span>*</span><input name="phone" value={form.phone} onChange={change} autoComplete="tel" type="tel" required maxLength={30} placeholder="+91 98765 43210" /></label>
        </div>
        <div className="form-row">
          <label>Email <span>*</span><input name="email" value={form.email} onChange={change} autoComplete="email" type="email" required maxLength={200} placeholder="you@company.com" /></label>
          <label>Your company name <span>*</span><input name="company" value={form.company} onChange={change} autoComplete="organization" required maxLength={150} placeholder="Your company or brand" /></label>
        </div>
        <div className="form-row">
          <label>Country <span>*</span>
            <select name="country" value={form.country} onChange={change} autoComplete="country-name" required>
              <option value="" disabled>Select country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>City <span>*</span><input name="city" value={form.city} onChange={change} autoComplete="address-level2" required maxLength={100} placeholder="Your city" /></label>
        </div>
        <label>Message<textarea name="message" value={form.message} onChange={change} maxLength={3000} rows={3} placeholder="Your product idea, ingredients, quantities or timeline…" /></label>
        {error && <p className="form-note" role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
        <button className="button" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Submit'}<ArrowRight size={18} /></button>
      </form>
    </>}
  </Modal>;
}
