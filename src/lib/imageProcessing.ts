import "server-only";
import sharp from "sharp";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

type ProcessOptions = {
  width: number;
  height?: number;
  fit?: "cover" | "contain" | "inside";
  quality?: number;
  format?: "webp" | "jpeg";
};

export async function optimizeImage(
  file: File,
  options: ProcessOptions
): Promise<{ buffer: Buffer; contentType: string; extensao: string }> {
  // Validação defensiva no servidor (o atributo accept do input não é
  // controle de segurança). Mensagens são exibidas ao admin pelas actions.
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Arquivo de imagem inválido.");
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Formato de imagem não suportado. Use JPG, PNG ou WebP.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const input = Buffer.from(arrayBuffer);

  let pipeline;
  try {
    // limitInputPixels protege contra "decompression bomb".
    pipeline = sharp(input, { limitInputPixels: 50_000_000 }).rotate();
  } catch {
    throw new Error("Não foi possível processar a imagem enviada.");
  }

  if (options.height) {
    pipeline.resize(options.width, options.height, {
      fit: options.fit ?? "cover",
      withoutEnlargement: false,
    });
  } else {
    pipeline.resize({
      width: options.width,
      fit: options.fit ?? "inside",
      withoutEnlargement: true,
    });
  }

  const format = options.format ?? "webp";
  const quality = options.quality ?? 80;

  let buffer: Buffer;
  try {
    buffer =
      format === "jpeg"
        ? await pipeline.flatten({ background: "#ffffff" }).jpeg({ quality }).toBuffer()
        : await pipeline.webp({ quality }).toBuffer();
  } catch {
    // Arquivo corrompido, falso ou acima do limite de pixels.
    throw new Error("Não foi possível processar a imagem enviada.");
  }

  return {
    buffer,
    contentType: format === "jpeg" ? "image/jpeg" : "image/webp",
    extensao: format === "jpeg" ? "jpg" : "webp",
  };
}
