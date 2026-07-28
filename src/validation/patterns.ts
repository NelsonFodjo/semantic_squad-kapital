// ============================================================
// PATTERNS — every regular expression the app uses, in one place.
// ============================================================
// A regex is a pattern for text. We ask "does this text match?" with
// pattern.test(value).
//
// Reading the symbols:
//   ^      start of the text        $     end of the text
//   \d     any digit 0-9            \s    a space
//   [A-Z]  any uppercase letter     {2,5} between 2 and 5 of them
//   ?      optional                 +     one or more
//   *      zero or more             |     or
//   (...)  a group                  (?:)  a group we don't capture
//   \.     a literal dot (a bare . means "any character")
//
// Most patterns start with ^ and end with $ so they must match the
// WHOLE value, not just some piece hiding inside it.

export const patterns = {
  /* ---------- People ---------- */

  // you@example.com — text, @, domain, dot, 2+ letters
  email: /^[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}$/,

  // 3-20 characters, starts with a letter, then letters/numbers/_
  username: /^[A-Za-z]\w{2,19}$/,

  // Handles O'Brien, Anne-Marie, and Jean Baptiste. Requires at
  // least two words, because we ask for a full name.
  fullName: /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/,

  // Mauritian mobile or landline in international form: +230 5xxx xxxx
  // Spaces are allowed and stripped before checking.
  mauritiusPhone: /^\+230[ ]?\d{3}[ ]?\d{4,5}$/,

  // Any international number, for employers based abroad.
  internationalPhone: /^\+[1-9]\d{7,14}$/,

  /* ---------- Links ---------- */

  // Must start with http:// or https:// and have a real domain.
  website: /^https?:\/\/[\w-]+(?:\.[\w-]+)+(?:\/\S*)?$/,

  // A GitHub repository, not just any GitHub page.
  // Captures owner/repo and allows an optional trailing slash.
  githubRepo: /^https?:\/\/(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/,

  // A LinkedIn profile URL.
  linkedin: /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[\w-]+\/?$/i,

  // URL-friendly name used in addresses: /showcase/water-sensor-mesh
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /* ---------- Organisations ---------- */

  // Mauritius Business Registration Number: the letter C then 8 digits.
  brn: /^C\d{8}$/i,

  // Mauritius VAT registration number: VAT then 8 digits.
  vat: /^VAT\d{8}$/i,

  /* ---------- Numbers, money, dates ---------- */

  // A whole number of rupees. No commas, no symbol.
  stipend: /^\d{1,7}$/,

  // Money with optional decimals: 1000 or 1000.50
  amount: /^\d+(?:\.\d{1,2})?$/,

  // Duration of an internship, 1 to 52 weeks.
  weeks: /^(?:[1-9]|[1-4]\d|5[0-2])$/,

  // A percentage from 0 to 100.
  percent: /^(?:100|\d{1,2})(?:\.\d{1,2})?$/,

  // A date as YYYY-MM-DD. Month must be 01-12, day 01-31.
  // This checks the SHAPE only — see isRealDate in rules.ts for the
  // "does 31 February exist" question, which regex cannot answer.
  date: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,

  // Academic year of study, 1 to 6.
  yearOfStudy: /^[1-6]$/,

  // A 6-digit email verification code.
  otpCode: /^\d{6}$/,

  /* ---------- Free text guards ---------- */

  // A comma-separated skills list: "React, SQL, Figma"
  skillList: /^[\w+#.\- ]+(?:,[\w+#.\- ]+)*$/,

  // Rejects text that is only symbols or whitespace — catches "...."
  // and "!!!!" being submitted as a cover letter.
  hasRealWords: /[A-Za-z]{3,}/,

  // Blocks anyone pasting a script tag into a text field. Belt and
  // braces: React already escapes output, and the database is the
  // real line of defence.
  looksLikeHtml: /<\/?[a-z][\s\S]*>/i,

  /* ---------- Password composition ----------
     These are NOT anchored, because here we are asking "does this
     character appear ANYWHERE in the text", not "is the whole text
     this character". */
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSymbol: /[^A-Za-z0-9]/,
  hasSpace: /\s/,

  // Three or more of the same character in a row: "aaa", "111".
  // \1 means "the same thing the first group matched".
  hasRepeat: /(.)\1{2,}/,

  // Obvious keyboard runs and sequences people use in weak passwords.
  hasSequence: /(?:012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|wer|asd|zxc)/i,
};
