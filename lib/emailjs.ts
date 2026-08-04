import emailjs from "@emailjs/browser";

const SERVICE_ID = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) as string;
const TEMPLATE_ID = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) as string;
const PUBLIC_KEY = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) as string;

// Initialize once with the public key
if (PUBLIC_KEY) {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

export interface AgentApprovalParams {
  to_name: string;
  to_email: string;
  license_number: string;
  platform_name?: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`EmailJS request timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

export async function sendAgentApprovalEmail(params: AgentApprovalParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS credentials are not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env"
    );
  }

  const result = await withTimeout(
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_name: params.to_name,
      to_email: params.to_email,
      license_number: params.license_number,
      platform_name: params.platform_name ?? "Panpata",
      subject: `Your Panpata Agent Application is Approved 🎉`,
    }),
    10_000
  );

  if (result.status !== 200) {
    throw new Error(`EmailJS responded with status ${result.status}: ${result.text}`);
  }
}
