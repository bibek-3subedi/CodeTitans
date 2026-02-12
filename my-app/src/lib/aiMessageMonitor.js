// AI-powered message monitoring: detects and sanitizes personal information

export function monitorMessage(messageBody) {
  const violations = [];
  let sanitized = messageBody;

  // Phone number patterns (Nepal: 98XXXXXXXX, +977-98XXXXXXXX, etc.)
  const phonePatterns = [
    /\b98\d{8}\b/g, // 98XXXXXXXX
    /\b\+977[- ]?98\d{8}\b/gi, // +977-98XXXXXXXX
    /\b\d{3}[- ]?\d{3}[- ]?\d{4}\b/g, // XXX-XXX-XXXX
    /\b\d{10}\b/g, // 10 digits
  ];

  phonePatterns.forEach((pattern) => {
    const matches = sanitized.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        violations.push({
          type: 'phone',
          original: match,
          position: sanitized.indexOf(match),
        });
        sanitized = sanitized.replace(match, '****');
      });
    }
  });

  // Email patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = sanitized.match(emailPattern);
  if (emailMatches) {
    emailMatches.forEach((match) => {
      violations.push({
        type: 'email',
        original: match,
        position: sanitized.indexOf(match),
      });
      sanitized = sanitized.replace(match, '****@****.***');
    });
  }

  // Address patterns (Kathmandu-specific)
  const addressPatterns = [
    /\b\d+[- ]?(?:road|street|lane|marg|chowk|tole|basti|tol)\b/gi,
    /\b(?:kathmandu|koteshwor|thamel|new road|baneshwor|patan|lalitpur|bhaktapur)[\s,]+(?:nepal)?\b/gi,
    /\b(?:ward|tole|basti)\s+\d+\b/gi,
  ];

  addressPatterns.forEach((pattern) => {
    const matches = sanitized.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        violations.push({
          type: 'address',
          original: match,
          position: sanitized.indexOf(match),
        });
        sanitized = sanitized.replace(match, '****');
      });
    }
  });

  // Social media / external links
  const linkPatterns = [
    /\b(?:facebook|fb|instagram|ig|twitter|whatsapp|viber|telegram|messenger)\.(?:com|me|net)\/[^\s]+\b/gi,
    /\b(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?\b/gi,
  ];

  linkPatterns.forEach((pattern) => {
    const matches = sanitized.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        violations.push({
          type: 'external_link',
          original: match,
          position: sanitized.indexOf(match),
        });
        sanitized = sanitized.replace(match, '****');
      });
    }
  });

  return {
    sanitized,
    violations,
    hasViolations: violations.length > 0,
  };
}

export function createViolationRecord(messageId, violations, fromRole, fromId) {
  return {
    id: `violation-${Date.now()}`,
    messageId,
    timestamp: new Date().toISOString(),
    fromRole,
    fromId,
    violations: violations.map((v) => ({
      type: v.type,
      original: v.original,
    })),
    severity: violations.length > 2 ? 'high' : 'medium',
  };
}
