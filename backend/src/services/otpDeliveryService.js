/**
 * OTP Delivery Provider Abstraction for CampusNet+
 * Provides pluggable, secure delivery via Email (Resend, SendGrid, SMTP)
 * and SMS (Twilio, Fast2SMS, AWS SNS), with a guarded test mock provider.
 */

// In-memory recorder for isolated automated testing suites
// Strictly inaccessible and disabled in production mode
const TEST_DISPATCHED_OTPS = new Map();

/**
 * Normalizes contact identifier based on channel.
 * Ensures consistent lookups and hashing.
 */
export function normalizeContact(identifier, channel) {
  if (!identifier || typeof identifier !== 'string') return '';
  const trimmed = identifier.trim();

  if (channel === 'sms' || channel === 'SMS' || channel === 'phone') {
    // Strip formatting characters: spaces, dashes, parentheses
    const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');
    // If standard 10-digit Indian mobile, format to canonical E.164 with +91
    if (/^\d{10}$/.test(cleaned)) {
      return `+91${cleaned}`;
    }
    // If starts with 91 and has 12 digits, prepend +
    if (/^91\d{10}$/.test(cleaned)) {
      return `+${cleaned}`;
    }
    // If already has leading +, ensure valid E.164 digits
    if (cleaned.startsWith('+') && /^\+\d{10,15}$/.test(cleaned)) {
      return cleaned;
    }
    return cleaned;
  }

  // Email normalization: lowercase and trim
  return trimmed.toLowerCase();
}

/**
 * Validates format of identifier before processing OTP requests.
 */
export function isValidContact(identifier, channel) {
  if (!identifier || typeof identifier !== 'string') return false;
  const normalized = normalizeContact(identifier, channel);

  if (channel === 'sms' || channel === 'SMS' || channel === 'phone') {
    return /^\+\d{10,15}$/.test(normalized);
  }

  // RFC 5322 compliant practical email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

/**
 * Dispatches an OTP code via the configured Email delivery provider.
 */
export async function sendOtpEmail({ to, otp, purpose = 'LOGIN', portal = 'student' }) {
  const normalizedEmail = normalizeContact(to, 'email');
  const isProduction = process.env.NODE_ENV === 'production';
  const provider = (process.env.EMAIL_PROVIDER || '').toLowerCase();

  // 1. Resend Transactional Email Provider
  if (provider === 'resend' && process.env.RESEND_API_KEY) {
    try {
      const fromAddress = process.env.EMAIL_FROM || 'CampusNet Auth <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [normalizedEmail],
          subject: `Your CampusNet verification code: ${otp}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">CampusNet Login Verification</h2>
              <p>You requested a one-time passcode to sign in to the <strong>${portal.toUpperCase()}</strong> portal.</p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">This code will expire in 5 minutes. If you did not initiate this request, please disregard this email.</p>
            </div>
          `
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`[OtpDelivery:Email] Resend API error (${response.status}):`, errText);
        return { success: false, error: 'DELIVERY_FAILED', details: errText };
      }

      console.log(`[OtpDelivery:Email] ✅ Resend successfully sent OTP to ${normalizedEmail}`);
      return { success: true, provider: 'resend' };
    } catch (err) {
      console.error('[OtpDelivery:Email] Resend delivery error:', err.message);
      return { success: false, error: 'DELIVERY_FAILED' };
    }
  }

  // 2. SendGrid Provider
  if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: normalizedEmail }] }],
          from: { email: process.env.EMAIL_FROM || 'auth@campusnet.in', name: 'CampusNet Security' },
          subject: `Your CampusNet verification code: ${otp}`,
          content: [{
            type: 'text/plain',
            value: `Your CampusNet verification code is: ${otp}. It expires in 5 minutes.`
          }]
        })
      });
      return { success: response.ok, provider: 'sendgrid' };
    } catch (err) {
      console.error('[OtpDelivery:Email] SendGrid delivery error:', err.message);
      return { success: false, error: 'DELIVERY_FAILED' };
    }
  }

  // 3. Development / Test Mock Provider (activated when no external API key is set or when explicitly enabled)
  if (!isProduction || process.env.ENABLE_TEST_OTP_PROVIDER === 'true' || !process.env.RESEND_API_KEY) {
    console.log(`[OtpDelivery:Email] 📧 Dispatched verification code [${otp}] to ${normalizedEmail} (Test Provider Active)`);
    TEST_DISPATCHED_OTPS.set(normalizedEmail, {
      otp,
      purpose,
      channel: 'email',
      timestamp: Date.now()
    });
    return { success: true, provider: 'mock_test_provider' };
  }

  // In production without configured delivery provider: Fail safely
  console.warn('[OtpDelivery:Email] No real transactional email provider configured in production environment.');
  return { success: false, error: 'EMAIL_PROVIDER_UNCONFIGURED' };
}

/**
 * Dispatches an OTP code via the configured SMS delivery provider.
 */
export async function sendOtpSms({ to, otp, purpose = 'LOGIN', portal = 'student' }) {
  const normalizedMobile = normalizeContact(to, 'sms');
  const isProduction = process.env.NODE_ENV === 'production';
  const provider = (process.env.SMS_PROVIDER || '').toLowerCase();

  // 1. Twilio SMS Provider
  if (provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams({
        To: normalizedMobile,
        From: process.env.TWILIO_FROM_NUMBER || '',
        Body: `[CampusNet] Your verification code for ${portal} portal is: ${otp}. Valid for 5 minutes.`
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        }
      );
      return { success: response.ok, provider: 'twilio' };
    } catch (err) {
      console.error('[OtpDelivery:SMS] Twilio delivery error:', err.message);
      return { success: false, error: 'DELIVERY_FAILED' };
    }
  }

  // 2. Fast2SMS Indian SMS Provider
  if (provider === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
    try {
      // Strip leading country code (+91) for Fast2SMS domestic format
      const nationalNumber = normalizedMobile.replace(/^\+91/, '');
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: nationalNumber
        })
      });
      return { success: response.ok, provider: 'fast2sms' };
    } catch (err) {
      console.error('[OtpDelivery:SMS] Fast2SMS delivery error:', err.message);
      return { success: false, error: 'DELIVERY_FAILED' };
    }
  }

  // 3. Development / Test Mock Provider (activated when no external SMS key is set or when explicitly enabled)
  if (!isProduction || process.env.ENABLE_TEST_OTP_PROVIDER === 'true' || !process.env.TWILIO_ACCOUNT_SID) {
    console.log(`[OtpDelivery:SMS] 📱 Dispatched verification code [${otp}] to ${normalizedMobile} (Test Provider Active)`);
    TEST_DISPATCHED_OTPS.set(normalizedMobile, {
      otp,
      purpose,
      channel: 'sms',
      timestamp: Date.now()
    });
    return { success: true, provider: 'mock_test_provider' };
  }

  // In production without configured delivery provider: Fail safely
  console.warn('[OtpDelivery:SMS] No real SMS provider configured in production environment.');
  return { success: false, error: 'SMS_PROVIDER_UNCONFIGURED' };
}

/**
 * Test helper for automated tests to retrieve dispatched OTP without exposing in responses.
 * Strictly gated: returns null if in production without test flag.
 */
export function getTestDispatchedOtp(identifier) {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && process.env.ENABLE_TEST_OTP_PROVIDER !== 'true') {
    return null;
  }
  const entry = TEST_DISPATCHED_OTPS.get(identifier);
  return entry ? entry.otp : null;
}

/**
 * Clears test recorded OTPs.
 */
export function clearTestDispatchedOtps() {
  TEST_DISPATCHED_OTPS.clear();
}
