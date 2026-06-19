import emailjs from "@emailjs/browser";

export interface AcademyContactParams {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  country?: string;
  service_interest?: string;
  message: string;
  source_page?: string;
}

export async function sendAcademyContact(params: AcademyContactParams) {
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
  const TEMPLATE_ORG = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORG || "";
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

  const templateParams = {
    from_name: params.name,
    from_email: params.email,
    to_name: params.name,
    to_email: params.email,
    user_email: params.email,
    reply_to: params.email,
    email: params.email,
    name: params.name,
    full_name: params.name,
    organization: params.organization || "N/A",
    phone: params.phone || "N/A",
    country: params.country || "N/A",
    service_interest: params.service_interest || "N/A",
    message: params.message,
    source_page: params.source_page || "contact",
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ORG, templateParams, PUBLIC_KEY);
}
