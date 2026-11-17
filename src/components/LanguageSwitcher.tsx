import { useEffect, useState, type ChangeEvent } from 'react';
import { Globe } from 'lucide-react';

/**
 * Whole-site translation through the Google Website Translator.
 *
 * The chosen language lives in Google's own `googtrans` cookie ("/en/<code>").
 * The translator script is only loaded when a non-English language is selected,
 * so English visitors make no request to Google.
 */

type Language = { code: string; native: string; english: string };

// Shown first: languages of Gomzi's main export markets.
const POPULAR: Language[] = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'ar', native: 'العربية', english: 'Arabic' },
  { code: 'fr', native: 'Français', english: 'French' },
  { code: 'es', native: 'Español', english: 'Spanish' },
  { code: 'pt', native: 'Português', english: 'Portuguese' },
  { code: 'ru', native: 'Русский', english: 'Russian' },
  { code: 'zh-CN', native: '中文 (简体)', english: 'Chinese (Simplified)' },
  { code: 'de', native: 'Deutsch', english: 'German' },
  { code: 'sw', native: 'Kiswahili', english: 'Swahili' },
  { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian' },
  { code: 'tr', native: 'Türkçe', english: 'Turkish' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'si', native: 'සිංහල', english: 'Sinhala' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
];

const OTHERS: Language[] = [
  { code: 'af', native: 'Afrikaans', english: 'Afrikaans' },
  { code: 'sq', native: 'Shqip', english: 'Albanian' },
  { code: 'am', native: 'አማርኛ', english: 'Amharic' },
  { code: 'hy', native: 'Հայերեն', english: 'Armenian' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { code: 'az', native: 'Azərbaycan', english: 'Azerbaijani' },
  { code: 'eu', native: 'Euskara', english: 'Basque' },
  { code: 'be', native: 'Беларуская', english: 'Belarusian' },
  { code: 'bs', native: 'Bosanski', english: 'Bosnian' },
  { code: 'bg', native: 'Български', english: 'Bulgarian' },
  { code: 'my', native: 'မြန်မာ', english: 'Burmese' },
  { code: 'ca', native: 'Català', english: 'Catalan' },
  { code: 'ceb', native: 'Cebuano', english: 'Cebuano' },
  { code: 'ny', native: 'Chichewa', english: 'Chichewa' },
  { code: 'zh-TW', native: '中文 (繁體)', english: 'Chinese (Traditional)' },
  { code: 'co', native: 'Corsu', english: 'Corsican' },
  { code: 'hr', native: 'Hrvatski', english: 'Croatian' },
  { code: 'cs', native: 'Čeština', english: 'Czech' },
  { code: 'da', native: 'Dansk', english: 'Danish' },
  { code: 'nl', native: 'Nederlands', english: 'Dutch' },
  { code: 'eo', native: 'Esperanto', english: 'Esperanto' },
  { code: 'et', native: 'Eesti', english: 'Estonian' },
  { code: 'tl', native: 'Filipino', english: 'Filipino' },
  { code: 'fi', native: 'Suomi', english: 'Finnish' },
  { code: 'fy', native: 'Frysk', english: 'Frisian' },
  { code: 'gl', native: 'Galego', english: 'Galician' },
  { code: 'ka', native: 'ქართული', english: 'Georgian' },
  { code: 'el', native: 'Ελληνικά', english: 'Greek' },
  { code: 'ht', native: 'Kreyòl Ayisyen', english: 'Haitian Creole' },
  { code: 'ha', native: 'Hausa', english: 'Hausa' },
  { code: 'haw', native: 'ʻŌlelo Hawaiʻi', english: 'Hawaiian' },
  { code: 'iw', native: 'עברית', english: 'Hebrew' },
  { code: 'hmn', native: 'Hmoob', english: 'Hmong' },
  { code: 'hu', native: 'Magyar', english: 'Hungarian' },
  { code: 'is', native: 'Íslenska', english: 'Icelandic' },
  { code: 'ig', native: 'Igbo', english: 'Igbo' },
  { code: 'ga', native: 'Gaeilge', english: 'Irish' },
  { code: 'it', native: 'Italiano', english: 'Italian' },
  { code: 'ja', native: '日本語', english: 'Japanese' },
  { code: 'jw', native: 'Basa Jawa', english: 'Javanese' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'kk', native: 'Қазақ', english: 'Kazakh' },
  { code: 'km', native: 'ខ្មែរ', english: 'Khmer' },
  { code: 'rw', native: 'Kinyarwanda', english: 'Kinyarwanda' },
  { code: 'ko', native: '한국어', english: 'Korean' },
  { code: 'ku', native: 'Kurdî', english: 'Kurdish' },
  { code: 'ky', native: 'Кыргызча', english: 'Kyrgyz' },
  { code: 'lo', native: 'ລາວ', english: 'Lao' },
  { code: 'la', native: 'Latina', english: 'Latin' },
  { code: 'lv', native: 'Latviešu', english: 'Latvian' },
  { code: 'lt', native: 'Lietuvių', english: 'Lithuanian' },
  { code: 'lb', native: 'Lëtzebuergesch', english: 'Luxembourgish' },
  { code: 'mk', native: 'Македонски', english: 'Macedonian' },
  { code: 'mg', native: 'Malagasy', english: 'Malagasy' },
  { code: 'ms', native: 'Bahasa Melayu', english: 'Malay' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'mt', native: 'Malti', english: 'Maltese' },
  { code: 'mi', native: 'Māori', english: 'Maori' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'mn', native: 'Монгол', english: 'Mongolian' },
  { code: 'ne', native: 'नेपाली', english: 'Nepali' },
  { code: 'no', native: 'Norsk', english: 'Norwegian' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'ps', native: 'پښتو', english: 'Pashto' },
  { code: 'fa', native: 'فارسی', english: 'Persian' },
  { code: 'pl', native: 'Polski', english: 'Polish' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'ro', native: 'Română', english: 'Romanian' },
  { code: 'sm', native: 'Gagana Samoa', english: 'Samoan' },
  { code: 'gd', native: 'Gàidhlig', english: 'Scots Gaelic' },
  { code: 'sr', native: 'Српски', english: 'Serbian' },
  { code: 'st', native: 'Sesotho', english: 'Sesotho' },
  { code: 'sn', native: 'Shona', english: 'Shona' },
  { code: 'sd', native: 'سنڌي', english: 'Sindhi' },
  { code: 'sk', native: 'Slovenčina', english: 'Slovak' },
  { code: 'sl', native: 'Slovenščina', english: 'Slovenian' },
  { code: 'so', native: 'Soomaali', english: 'Somali' },
  { code: 'su', native: 'Basa Sunda', english: 'Sundanese' },
  { code: 'sv', native: 'Svenska', english: 'Swedish' },
  { code: 'tg', native: 'Тоҷикӣ', english: 'Tajik' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'tt', native: 'Татар', english: 'Tatar' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'th', native: 'ไทย', english: 'Thai' },
  { code: 'tk', native: 'Türkmen', english: 'Turkmen' },
  { code: 'uk', native: 'Українська', english: 'Ukrainian' },
  { code: 'ur', native: 'اردو', english: 'Urdu' },
  { code: 'ug', native: 'ئۇيغۇرچە', english: 'Uyghur' },
  { code: 'uz', native: 'Oʻzbek', english: 'Uzbek' },
  { code: 'vi', native: 'Tiếng Việt', english: 'Vietnamese' },
  { code: 'cy', native: 'Cymraeg', english: 'Welsh' },
  { code: 'xh', native: 'isiXhosa', english: 'Xhosa' },
  { code: 'yi', native: 'ייִדיש', english: 'Yiddish' },
  { code: 'yo', native: 'Yorùbá', english: 'Yoruba' },
  { code: 'zu', native: 'isiZulu', english: 'Zulu' },
];

const ALL_CODES = new Set([...POPULAR, ...OTHERS].map((l) => l.code));
const SCRIPT_ID = 'google-translate-script';

function readLanguage(): string {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  const code = match ? decodeURIComponent(match[1]) : 'en';
  return ALL_CODES.has(code) ? code : 'en';
}

function writeCookie(value: string | null) {
  const host = window.location.hostname;
  // Google may have set the cookie on the bare host and on the parent domain; clear/set both.
  const domains = ['', host, host.split('.').slice(-2).join('.')].filter((d, i, a) => a.indexOf(d) === i);
  for (const d of domains) {
    const domainPart = d ? `;domain=${d}` : '';
    document.cookie = value
      ? `googtrans=${value};path=/${domainPart}`
      : `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT${domainPart}`;
  }
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
  }
}

function loadTranslator() {
  if (document.getElementById(SCRIPT_ID)) return;
  window.googleTranslateElementInit = () => {
    const TE = window.google?.translate?.TranslateElement;
    if (TE) new TE({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
  };
  const s = document.createElement('script');
  s.id = SCRIPT_ID;
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.body.appendChild(s);
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<string>(() => readLanguage());

  useEffect(() => {
    if (lang !== 'en') loadTranslator();
  }, [lang]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    if (next === lang) return;
    writeCookie(next === 'en' ? null : `/en/${next}`);
    setLang(next);
    // A reload is the reliable way to apply (or remove) a translation on every page element.
    window.location.reload();
  };

  const option = (l: Language) => (
    <option key={l.code} value={l.code}>
      {l.native === l.english ? l.native : `${l.native} — ${l.english}`}
    </option>
  );

  return (
    <div className="lang-switch notranslate" translate="no">
      <Globe size={15} aria-hidden="true" />
      <select value={lang} onChange={onChange} aria-label="Select website language">
        <optgroup label="Popular">{POPULAR.map(option)}</optgroup>
        <optgroup label="All languages">{OTHERS.map(option)}</optgroup>
      </select>
      <div id="google_translate_element" hidden />
    </div>
  );
}
