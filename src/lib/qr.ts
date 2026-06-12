import QRCode from "qrcode";

export async function generateQrDataUrl(tableId: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const url = `${base}/order/${tableId}`;
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1A0B04", light: "#F4ECD9" },
  });
}

export async function generateQrBuffer(tableId: string): Promise<Buffer> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const url = `${base}/order/${tableId}`;
  return QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1A0B04", light: "#F4ECD9" },
  });
}
