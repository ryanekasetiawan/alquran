import sharp from "sharp";
import fs from "fs";
import path from "path";

// Folder input (tempat gambar asli berada)
const inputFolder = path.join(process.cwd(), "src/assets/images");
// Folder output (tempat gambar yang dikompresi akan disimpan)
const outputFolder = path.join(process.cwd(), "dist/assets/images");

// Membuat folder output jika belum ada
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Fungsi untuk compress gambar
const compressImages = async () => {
  try {
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, file);

      await sharp(inputFilePath)
        .resize(800) // Resize gambar menjadi maksimal 800px
        .jpeg({ quality: 70 }) // Set kualitas gambar (JPEG) menjadi 70%
        .toFile(outputFilePath);

      console.log(`Compressed ${file} -> ${outputFilePath}`);
    }
  } catch (error) {
    console.error("Error compressing images:", error);
  }
};

compressImages();
