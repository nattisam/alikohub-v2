// test-emailjs.js
// Run: node test-emailjs.js
// Tests both templates to verify credentials and variable mappings.

const SERVICE_ID = 'service_o3ddr1m';
const TEMPLATE_USER = 'template_rtnjjta';   // → User confirmation email
const TEMPLATE_ORG = 'template_2e4m9ye';   // → Org admin notification email
const PUBLIC_KEY = 'VfqWXhjaQ_YseFSe2';

const templateParams = {
    from_name: 'Test User',
    from_email: 'test@example.com',
    to_name: 'Test User',
    to_email: 'test@example.com',
    user_email: 'test@example.com',
    reply_to: 'test@example.com',
    email: 'test@example.com',
    name: 'Test User',
    full_name: 'Test User',
    organization: 'Test Organization',
    role: 'Developer',
    partnership_interest: 'Investor',
    message: 'This is a test message to verify EmailJS credentials and template variable bindings.',
};

async function sendEmail(label, templateId) {
    const data = {
        service_id: SERVICE_ID,
        template_id: templateId,
        user_id: PUBLIC_KEY,
        template_params: templateParams,
    };

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log(`✅ [${label}] Email sent successfully (template: ${templateId})`);
        } else {
            const text = await response.text();
            console.error(`❌ [${label}] Failed (status ${response.status}): ${text}`);
        }
    } catch (err) {
        console.error(`❌ [${label}] Network error:`, err.message);
    }
}

(async () => {
    console.log('--- EmailJS Template Test ---\n');
    await sendEmail('User Confirmation', TEMPLATE_USER);
    await sendEmail('Org Notification', TEMPLATE_ORG);
    console.log('\n--- Done ---');
})();
