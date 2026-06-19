export function checkDocumentValidity(document) {
  const issueDate = new Date(document.date);
  const now = new Date();
  const monthsOld = (now - issueDate) / (1000 * 60 * 60 * 24 * 30);

  const validityRules = {
    aadhaar: { maxMonths: 120, label: 'Lifetime' },
    pan: { maxMonths: 120, label: 'Lifetime' },
    dl: { maxMonths: 60, label: '5 Years' },
    passport: { maxMonths: 120, label: '10 Years' },
    insurance: { maxMonths: 12, label: '1 Year' },
    default: { maxMonths: 36, label: '3 Years' },
  };

  const rule = validityRules[document.category] || validityRules.default;
  const isValid = monthsOld < rule.maxMonths;
  const daysRemaining = Math.max(0, Math.floor(rule.maxMonths * 30 - (now - issueDate) / (1000 * 60 * 60 * 24)));

  return {
    isValid,
    daysRemaining,
    validityLabel: rule.label,
    expiresAt: new Date(issueDate.getTime() + rule.maxMonths * 30 * 24 * 60 * 60 * 1000),
  };
}
