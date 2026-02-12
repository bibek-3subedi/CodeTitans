// Simple "AI" helpers for KYC verification and match explanations.

// Mock AI verification for KYC data
export async function verifyKycWithAi(kycPayload) {
  const issues = [];

  if (!kycPayload.fullName || kycPayload.fullName.trim().split(' ').length < 2) {
    issues.push('Full name looks incomplete. Please use your legal full name.');
  }

  if (!kycPayload.idNumber || kycPayload.idNumber.trim().length < 6) {
    issues.push('ID number seems too short.');
  }

  // eslint-disable-next-line no-useless-escape
  if (!/^[A-Za-z0-9-]+$/.test(kycPayload.idNumber || '')) {
    issues.push('ID number contains unusual characters.');
  }

  const approved = issues.length === 0;

  return {
    approved,
    riskScore: approved ? 0.1 : 0.6,
    issues,
    aiSummary: approved
      ? 'KYC details look consistent and complete based on basic checks.'
      : 'Some fields look incomplete or inconsistent. Please double-check before trusting this user.',
  };
}

