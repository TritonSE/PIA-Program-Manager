export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}
