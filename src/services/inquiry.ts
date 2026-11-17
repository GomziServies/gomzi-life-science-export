// Sends website enquiries to the FG API. The API saves them as a lead in the CRM (GLS section)
// and e-mails the acknowledgment with exports@gomzilifescience.com in CC.

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:80' : 'https://api.fggroup.in')
).replace(/\/+$/, '');

// The API recognises this site (and the CC mailbox) by the "/export-website/" part of the source.
// Keep it away from "https://gomzilifesciences.in/contact": that exact URL requires e-mail OTP on the API.
const SOURCE_BASE = 'https://gomzilifesciences.in/export-website';

export type InquiryForm = 'contact-page' | 'side-form' | 'popup-form';

export type InquiryInput = {
  form: InquiryForm;
  name: string;
  phone: string;
  email: string;
  company?: string;
  country: string;
  city: string;
  service?: string;
  message?: string;
};

export async function submitInquiry(input: InquiryInput): Promise<void> {
  const v = (s?: string) => (s ?? '').trim();
  const company = v(input.company);
  const service = v(input.service);
  const note = v(input.message);

  const message = [
    company && `Company: ${company}`,
    `Country: ${v(input.country)}`,
    `City: ${v(input.city)}`,
    service && `Service required: ${service}`,
    note && `\n${note}`,
  ].filter(Boolean).join('\n');

  const payload = {
    name: v(input.name),
    email: v(input.email),
    mobile: v(input.phone),
    // Subject must say "GLS" (shows in the CRM GLS section) and avoid course/gym keywords (brand detection)
    subject: 'GLS Export Website Enquiry',
    message,
    source: `${SOURCE_BASE}/${input.form}`,
    details: {
      company,
      country: v(input.country),
      city: v(input.city),
      service,
      form: input.form,
      page_url: window.location.href,
    },
  };

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/public/v1/contact-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error('We could not send your enquiry. Please check your connection and try again.');
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.status !== 200) {
    throw new Error(result?.message || 'Your enquiry could not be sent. Please try again.');
  }
}
