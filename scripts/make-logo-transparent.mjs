import sharp from "sharp";

function colorKey(r, g, b) {
  return `${r},${g},${b}`;
}

function colorDistanceSq(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

async function main() {
  const inputPath = process.argv[2] || "public/logo-terrasrurais-xadrez.png";
  const outputPath = process.argv[3] || "public/logo-terrasrurais.png";

  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels !== 4) {
    throw new Error(`Imagem inesperada: channels=${channels} (esperado 4 / RGBA).`);
  }

  // Amostra um quadrado no canto superior esquerdo para detectar as 2 cores do “xadrez”.
  // A ideia é pegar as duas cores mais frequentes e tratar como “fundo”.
  const sampleSize = Math.min(120, width, height);
  const counts = new Map();

  for (let y = 0; y < sampleSize; y++) {
    for (let x = 0; x < sampleSize; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const key = colorKey(r, g, b);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  const topColors = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6) // pega alguns candidatos e depois escolhe 2 mais “distintos”
    .map(([k]) => k.split(",").map((n) => Number(n)));

  if (topColors.length < 2) {
    throw new Error("Não consegui detectar as cores de fundo no canto da imagem.");
  }

  // Escolhe a cor #1 como a mais frequente e a cor #2 como a mais distante dela (para pegar os dois tons do xadrez).
  const bg1 = topColors[0];
  let bg2 = topColors[1];
  let maxDist = -1;
  for (const c of topColors.slice(1)) {
    const d = colorDistanceSq(bg1, c);
    if (d > maxDist) {
      maxDist = d;
      bg2 = c;
    }
  }

  // Threshold “generoso” porque compressão/antialias pode variar tons de cinza.
  const threshold = 38; // em distância por canal aprox
  const thresholdSq = threshold * threshold * 3;

  const out = Buffer.from(data); // cópia

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    const d1 = colorDistanceSq([r, g, b], bg1);
    const d2 = colorDistanceSq([r, g, b], bg2);

    if (Math.min(d1, d2) <= thresholdSq) {
      // Pixel do fundo → transparente
      out[i + 3] = 0;
    } else {
      // Mantém opaco
      out[i + 3] = 255;
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`OK: gerado ${outputPath} (fundo transparente) a partir de ${inputPath}`);
}

main().catch((err) => {
  console.error("Erro ao gerar PNG transparente:", err?.message || err);
  process.exit(1);
});

