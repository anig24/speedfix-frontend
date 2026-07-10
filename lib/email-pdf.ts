import PDFDocument from "pdfkit";

export type InvoicePdfLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoicePdfInput = {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  gstNumber?: string;
  paymentLink?: string;
  currency?: string;
  subtotal: number;
  tax: number;
  total: number;
  lineItems: InvoicePdfLineItem[];
};

function formatAmount(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function generateInvoicePdf(input: InvoicePdfInput) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fontSize(24)
      .fillColor("#111827")
      .text("SpeedFix", { continued: true })
      .fontSize(11)
      .fillColor("#64748b")
      .text("  Service invoice", { align: "right" });

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#64748b").text("speedfix.co.in");
    doc.text("support@speedfix.co.in | +91-7439769525");
    doc.moveDown(2);

    doc.fontSize(18).fillColor("#111827").text(`Invoice ${input.invoiceNumber}`);
    doc.moveDown(0.8);
    doc.fontSize(10).fillColor("#475569");
    doc.text(`Customer: ${input.customerName}`);

    if (input.customerEmail) {
      doc.text(`Email: ${input.customerEmail}`);
    }

    if (input.customerAddress) {
      doc.text(`Address: ${input.customerAddress}`);
    }

    if (input.gstNumber) {
      doc.text(`GST: ${input.gstNumber}`);
    }

    doc.moveDown(1.5);
    const startY = doc.y;
    doc
      .fontSize(10)
      .fillColor("#111827")
      .text("Description", 48, startY)
      .text("Qty", 320, startY)
      .text("Rate", 370, startY)
      .text("Total", 470, startY);

    doc.moveTo(48, startY + 18).lineTo(545, startY + 18).strokeColor("#e2e8f0").stroke();
    doc.moveDown(1.4);

    input.lineItems.forEach((item) => {
      const rowY = doc.y;
      doc
        .fontSize(9)
        .fillColor("#334155")
        .text(item.description, 48, rowY, { width: 250 })
        .text(String(item.quantity), 320, rowY)
        .text(formatAmount(item.unitPrice, input.currency), 370, rowY)
        .text(formatAmount(item.total, input.currency), 470, rowY);
      doc.moveDown(1);
    });

    doc.moveDown(1);
    const totalsX = 360;
    doc.fontSize(10).fillColor("#334155");
    doc.text("Subtotal", totalsX, doc.y, { continued: true }).text(formatAmount(input.subtotal, input.currency), { align: "right" });
    doc.text("GST/Tax", totalsX, doc.y, { continued: true }).text(formatAmount(input.tax, input.currency), { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#111827");
    doc.text("Total", totalsX, doc.y, { continued: true }).text(formatAmount(input.total, input.currency), { align: "right" });

    if (input.paymentLink) {
      doc.moveDown(2);
      doc.fontSize(10).fillColor("#2563eb").text(`Payment link: ${input.paymentLink}`);
    }

    doc.moveDown(3);
    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text("Thank you for choosing SpeedFix. This invoice was generated electronically.");

    doc.end();
  });
}
