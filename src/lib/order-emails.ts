import {
  formatProduct,
  getProductConfig,
  getProductType,
  productRequiresIntake,
  resolveProductDownloadUrl,
  resolveProductId,
} from "@/lib/products";
import { type ProductType } from "@/lib/product-types";

function emailShell(body: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Xsycho Labs</title>
</head>
<body style="margin:0;padding:0;background:#050505;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;border:1px solid #7e22ce;border-radius:16px;padding:32px 28px;background:#0b0b0f;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a855f7;">Xsycho Labs</p>
      <h1 style="margin:0 0 28px;font-size:26px;font-weight:700;line-height:1.2;color:#ffffff;">Order Confirmed</h1>
      ${body}
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #27272a;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
          Xsycho Labs — Mixing, Mastering &amp; Custom Presets<br />
          Questions? Reply to this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildPremadePresetDeliveryEmail(input: {
  productName: string;
  downloadUrl: string | null;
}) {
  const { productName, downloadUrl } = input;

  const downloadSection = downloadUrl
    ? `
      <div style="margin:28px 0;text-align:center;">
        <a href="${downloadUrl}" style="display:inline-block;padding:16px 28px;background:linear-gradient(135deg,#9333ea,#a855f7);color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.02em;">
          Download ${productName}
        </a>
      </div>
      <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.12em;">Direct download link</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;word-break:break-all;">
        <a href="${downloadUrl}" style="color:#c084fc;text-decoration:underline;">${downloadUrl}</a>
      </p>
    `
    : `
      <p style="margin:24px 0;line-height:1.7;color:#fca5a5;font-size:15px;">
        Your download link is being prepared. If you don&apos;t receive it shortly, reply to this email and we&apos;ll send it right away.
      </p>
    `;

  return {
    subject: `Your ${productName} is ready to download`,
    html: emailShell(`
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#d4d4d8;">
        Thank you for your purchase. Your payment was successful and your preset is ready.
      </p>

      <div style="margin:24px 0;padding:18px 20px;border:1px solid #3b0764;border-radius:12px;background:#140820;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c084fc;">Product</p>
        <p style="margin:0;font-size:20px;font-weight:600;line-height:1.4;color:#ffffff;">${productName}</p>
      </div>

      ${downloadSection}

      <div style="margin-top:8px;padding-top:20px;border-top:1px solid #27272a;">
        <p style="margin:0 0 12px;font-size:13px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.12em;">Quick start</p>
        <ul style="margin:0;padding-left:20px;color:#d4d4d8;font-size:15px;line-height:1.8;">
          <li>Download your preset using the button above</li>
          <li>Load it in your DAW and dial in your input gain</li>
          <li>Reply if you need help getting set up</li>
        </ul>
      </div>
    `),
  };
}

function buildServiceIntakeEmail(input: {
  productName: string;
  productType: ProductType;
  submitUrl: string;
}) {
  const { productName, productType, submitUrl } = input;

  const intakeCopy: Record<
    Exclude<ProductType, "premade_preset">,
    { headline: string; bullets: string[]; cta: string }
  > = {
    custom_preset: {
      headline: "Complete your custom preset intake",
      bullets: [
        "Vocal style and available plugins",
        "Session notes",
        "Optional reference files",
      ],
      cta: "Complete Preset Intake",
    },
    mixing: {
      headline: "Submit your mix intake",
      bullets: [
        "Stems or multitrack files",
        "Mix notes",
        "Optional BPM, key, and references",
      ],
      cta: "Submit Mix Intake",
    },
    mastering: {
      headline: "Submit your master intake",
      bullets: [
        "Final mix file",
        "Master notes",
        "Optional loudness or reference notes",
      ],
      cta: "Submit Master Intake",
    },
    mix_master: {
      headline: "Submit your mix + master intake",
      bullets: [
        "Stems or project files",
        "Session notes",
        "Optional BPM, key, and references",
      ],
      cta: "Submit Bundle Intake",
    },
  };

  const copy = intakeCopy[productType as Exclude<ProductType, "premade_preset">];

  return {
    subject: `Next step: ${productName} intake — Xsycho Labs`,
    html: emailShell(`
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#d4d4d8;">
        Thank you for your order. Your payment for <strong style="color:#ffffff;">${productName}</strong> was successful.
      </p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#d4d4d8;">
        ${copy.headline}. Upload your files and session details so we can begin.
      </p>
      <div style="margin:28px 0;text-align:center;">
        <a href="${submitUrl}" style="display:inline-block;padding:16px 28px;background:linear-gradient(135deg,#9333ea,#a855f7);color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.02em;">
          ${copy.cta}
        </a>
      </div>
      <div style="margin-top:8px;padding-top:20px;border-top:1px solid #27272a;">
        <p style="margin:0 0 12px;font-size:13px;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.12em;">What to include</p>
        <ul style="margin:0;padding-left:20px;color:#d4d4d8;font-size:15px;line-height:1.8;">
          ${copy.bullets.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `),
  };
}

export function buildOrderConfirmationEmail(input: {
  productSlug: string;
  baseUrl: string;
  submitUrl: string;
}) {
  const productId = resolveProductId(input.productSlug);
  const config = getProductConfig(productId);
  const productName = config?.name ?? formatProduct(productId);
  const productType = config?.productType ?? getProductType(productId);
  const needsIntake = config?.requiresIntake ?? productRequiresIntake(productId);

  if (!needsIntake) {
    return buildPremadePresetDeliveryEmail({
      productName,
      downloadUrl: resolveProductDownloadUrl(productId, input.baseUrl),
    });
  }

  return buildServiceIntakeEmail({
    productName,
    productType,
    submitUrl: input.submitUrl,
  });
}

export function resolveProductTypeFromSession(session: {
  metadata?: Record<string, string> | null;
}): ProductType {
  const product = session.metadata?.product?.trim() || "";
  const fromMetadata = session.metadata?.product_type?.trim() as
    | ProductType
    | undefined;
  return fromMetadata || getProductType(product);
}

export function resolveProductSlugFromSession(session: {
  metadata?: Record<string, string> | null;
}): string {
  return resolveProductId(session.metadata?.product?.trim() || "");
}

export function sessionRequiresIntake(session: {
  metadata?: Record<string, string> | null;
}): boolean {
  const slug = resolveProductSlugFromSession(session);
  return productRequiresIntake(slug);
}
