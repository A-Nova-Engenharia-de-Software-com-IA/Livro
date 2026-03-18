import PDFDocument from "pdfkit";
import fs from "fs";

type QA = {
  q: string;
  a: string;
};

export function generatePreOpPDF(
  qa: { q: string; a: string }[],
  outputPath: string
) {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("FICHA PRÉ-ANESTÉSICA", { align: "center" });

    doc.moveDown(2);

    qa.forEach((item) => {
      doc.font("Helvetica-Bold").fontSize(11).text(item.q);
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(11).text(item.a);
      doc.moveDown(1);
    });

    doc.end();

    stream.on("finish", () => {
      console.log("✅ PDF gerado com sucesso!");
      stream.end();
      resolve();
    });

    stream.on("error", reject);
  });
}