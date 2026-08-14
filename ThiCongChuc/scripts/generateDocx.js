import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import fs from 'fs';
import path from 'path';
import { guides } from '../src/data/guides.js';

const filenameMap = {
  "v1-1": "v1-01-luat-vien-chuc-129-2025",
  "v1-2": "v1-02-nghi-dinh-259-2026",
  "v1-3": "v1-03-luat-tccqdp-72-2025",
  "v1-4": "v1-04-nghi-dinh-232-2026",
  "v1-5": "v1-05-hien-phap-2013-sua-doi-2025",
  "v1-6": "v1-06-nghi-quyet-dai-hoi-xiv",
  "v1-7": "v1-07-nghi-quyet-57-nq-tw",
  "v1-8": "v1-08-nghi-quyet-202-2025",
  "v1-9": "v1-09-nghi-quyet-1685-ubtvqh15",
  "v1-10": "v1-10-vbhn-15-co-che-dac-thu",
  "kt-1": "v2-01-thong-tu-24-2024",
  "kt-2": "v2-02-thong-tu-108-2025",
  "kt-3": "v2-03-luat-ke-toan-88-2015",
  "kt-4": "v2-04-nghi-dinh-174-2016",
  "kt-5": "v2-05-luat-56-2024",
  "kt-6": "v2-06-luat-nsgnn-89-2025",
  "kt-7": "v2-07-nghi-dinh-73-2026",
  "kt-8": "v2-08-thong-tu-26-2026",
  "kt-9": "v2-09-nghi-dinh-60-2021",
  "kt-10": "v2-10-nghi-dinh-111-2025",
  "kt-11": "v2-11-thong-tu-66-2024",
};

async function generateDocx(id, guide) {
  const children = [];

  children.push(
    new Paragraph({
      text: guide.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  children.push(
    new Paragraph({
      text: "THÔNG TIN VĂN BẢN",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "4F46E5" } }
    })
  );

  const infoLabels = {
    soHieu: "Số hiệu", loai: "Loại văn bản", ngayBanHanh: "Ngày ban hành",
    ngayHieuLuc: "Ngày hiệu lực", coQuan: "Cơ quan ban hành", thayThe: "Thay thế",
    cauTruc: "Cấu trúc", apDung: "Áp dụng",
  };

  for (const [key, value] of Object.entries(guide.info)) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${infoLabels[key] || key}: `, bold: true, font: "Roboto", size: 22 }),
          new TextRun({ text: value, font: "Roboto", size: 22 })
        ],
        spacing: { after: 80 }
      })
    );
  }

  children.push(new Paragraph({ text: "", spacing: { after: 200 } }));

  children.push(
    new Paragraph({
      text: "NỘI DUNG TRỌNG TÂM",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "4F46E5" } }
    })
  );

  for (const section of guide.sections) {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 }
      })
    );

    for (const line of section.content) {
      const isIndented = line.startsWith('  ') || line.startsWith('- ');
      const text = line.replace(/^[- ]+/, '').trim();

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: isIndented ? `• ${text}` : text,
              font: "Roboto",
              size: 22,
              bold: text.includes(':') && !text.includes('—') && text.indexOf(':') < 30
            })
          ],
          indent: isIndented ? { left: 720 } : undefined,
          spacing: { after: 60 }
        })
      );
    }
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

async function main() {
  const outputDir = path.join(process.cwd(), 'public', 'downloads');

  for (const [id, guide] of Object.entries(guides)) {
    const filename = filenameMap[id] || id;
    const filepath = path.join(outputDir, `${filename}.docx`);

    try {
      const buffer = await generateDocx(id, guide);
      fs.writeFileSync(filepath, buffer);
      console.log(`✓ ${filename}.docx`);
    } catch (err) {
      console.error(`✗ ${filename}: ${err.message}`);
    }
  }

  console.log('\nDone! Generated .docx files in public/downloads/');
}

main().catch(console.error);
