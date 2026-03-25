// import fs from 'fs'
// import path from 'path'
// import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
// import pdf from 'pdf-poppler'
// import Tesseract from 'tesseract.js'

// // esxtract text pdf

// export const extractResumeText = async(filePath) =>{
//     const buffer = await fs.promises.readFile(filePath)
//     const Uint8Array = new Uint8Array(buffer)
// //  try ext based pdf
// try{
//     const loadingTask = pdfjs.getDocument({data: Uint8Array});
//     const pdfDoc = await loadingTask.promise;

//     let extractedText = '';

//     for (let i = 1; i <= pdfDoc.numPages; i++) {
//         const page = await pdfDoc.getPage(i);
//         const content = await page.getTextContent();
//         extractedText += content.items.map(i => i.str).join('')+'\n';
        
//     }
//     if (extractedText.trim().length > 30) {
//         return extractedText;
//     }
// } catch (error) {
//     console.log('pdf text extraction failed');  
// }
// // step 2
// const ocrDir ='./ocr-temp';
// if (!fs.existSynce(ocrDir)) fs.mkdirSync(ocrDir);

//    const option = {
//     format: 'png',
//     out_dir: ocrDir,
//     out_prefix: path.basename(filePath, '.pdf'),
//     page: null,
//    };
//    await pdf.convert(filePath, option);
//    let finalText = '';

//    const images = fs.readdirSync(ocrDir);
//    for (const img of images){
//     const imgPath = path.join(ocrDir, img);

//     const {data} = await Tesseract.recognize(imgPath, 'eng',{
//         logger: m => console.log(`OCR ${img}:`, m.status),
        
//     });
//     finalText += data.text + '\n';

//     fs.rmSync(ocrDir, { recursive: true, force: true });
// return finalText;
//    }
// }

import fs from 'fs'
import path from 'path'
import "canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import pdf from 'pdf-poppler'
import Tesseract from 'tesseract.js'

pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";

// extract text from resume pdf
export const extractResumeText = async (filePath) => {

  // -------- Step 1: Try normal PDF text extraction --------
  try {
    const buffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjs.getDocument({ data: uint8Array });
    const pdfDoc = await loadingTask.promise;

    let extractedText = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      extractedText += content.items.map(item => item.str).join(' ') + '\n';
    }

    if (extractedText.trim().length > 30) {
      return extractedText;
    }
  } catch (error) {
    console.log('PDF text extraction failed, switching to OCR...');
  }

  // -------- Step 2: OCR fallback --------
  const ocrDir = './ocr-temp';

  if (!fs.existsSync(ocrDir)) {
    fs.mkdirSync(ocrDir, { recursive: true });
  }

  const options = {
    format: 'png',
    out_dir: ocrDir,
    out_prefix: path.basename(filePath, '.pdf'),
    page: null,
  };

  await pdf.convert(filePath, options);

  let finalText = '';

  const images = fs.readdirSync(ocrDir);

  for (const img of images) {
    const imgPath = path.join(ocrDir, img);

    const { data } = await Tesseract.recognize(
      imgPath,
      'eng',
      {
        logger: m =>
          console.log(`OCR ${img}: ${m.status} (${Math.round(m.progress * 100)}%)`)
      }
    );

    finalText += data.text + '\n';
  }

  // -------- Cleanup --------
  fs.rmSync(ocrDir, { recursive: true, force: true });

  return finalText;
};

