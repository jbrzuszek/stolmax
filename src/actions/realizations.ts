"use server";

import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { publishFilesToGithub, isGithubPublishConfigured } from "@/lib/github-publish";
import { uniqueRealizationSlug, type Realization } from "@/lib/realizations";

const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;
const DATA_PATH = path.join(process.cwd(), "src", "data", "realizations.json");

const metaSchema = z.object({
  title: z.string().trim().min(3, "Podaj nazwę realizacji (min. 3 znaki)."),
  description: z.string().trim().min(20, "Opis powinien mieć co najmniej 20 znaków."),
  location: z.string().trim().optional(),
  adminPassword: z.string().min(1, "Podaj hasło administratora."),
});

export type AddRealizationResult =
  | { success: true; slug: string; published: boolean; message: string }
  | { success: false; error: string };

function extensionFromMime(mime: string) {
  const normalized = mime.toLowerCase().trim();
  if (normalized === "image/png") return "png";
  if (normalized === "image/webp") return "webp";
  if (
    normalized === "image/jpeg" ||
    normalized === "image/jpg" ||
    normalized === "image/pjpeg" ||
    normalized === "image/jfif"
  ) {
    return "jpg";
  }
  return null;
}

function extensionFromFileName(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".webp")) return "webp";
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".jfif") ||
    lower.endsWith(".jpe")
  ) {
    return "jpg";
  }
  return null;
}

function resolveImageExtension(file: File) {
  return extensionFromMime(file.type) ?? extensionFromFileName(file.name);
}

async function readRealizationsFromDisk(): Promise<Realization[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Realization[];
  } catch {
    return [];
  }
}

async function githubFetchJson(path: string) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER ?? "jbrzuszek";
  const repo = process.env.GITHUB_REPO ?? "stolmax";

  if (!token) return null;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać ${path} z GitHuba (${response.status}).`);
  }

  const data = (await response.json()) as { content?: string; encoding?: string };
  if (!data.content) return null;

  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(decoded) as Realization[];
}

async function readExistingRealizations(): Promise<Realization[]> {
  if (isGithubPublishConfigured()) {
    try {
      const remote = await githubFetchJson("src/data/realizations.json");
      if (remote) return remote;
    } catch (error) {
      console.warn("GitHub read failed, falling back to local file:", error);
    }
  }

  return readRealizationsFromDisk();
}

async function writeLocalFiles(
  realization: Realization,
  imageFiles: Array<{ filename: string; buffer: Buffer }>,
  nextList: Realization[],
) {
  const dir = path.join(process.cwd(), "public", "realizacje", realization.slug);
  await fs.mkdir(dir, { recursive: true });

  for (const image of imageFiles) {
    await fs.writeFile(path.join(dir, image.filename), image.buffer);
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(nextList, null, 2)}\n`, "utf-8");
}

export async function addRealization(formData: FormData): Promise<AddRealizationResult> {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return {
        success: false,
        error: "Brak ADMIN_SECRET w .env.local. Ustaw hasło administratora.",
      };
    }

    const parsed = metaSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location") || undefined,
      adminPassword: formData.get("adminPassword"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane formularza.",
      };
    }

    if (parsed.data.adminPassword !== adminSecret) {
      return { success: false, error: "Nieprawidłowe hasło administratora." };
    }

    const uploads = formData.getAll("images").filter((item): item is File => item instanceof File);
    const validUploads = uploads.filter((file) => file.size > 0);

    if (validUploads.length === 0) {
      return { success: false, error: "Dodaj co najmniej jedno zdjęcie." };
    }

    if (validUploads.length > MAX_IMAGES) {
      return { success: false, error: `Możesz dodać maksymalnie ${MAX_IMAGES} zdjęć.` };
    }

    const preparedImages: Array<{ filename: string; buffer: Buffer }> = [];

    for (const [index, file] of validUploads.entries()) {
      if (file.size > MAX_IMAGE_BYTES) {
        return {
          success: false,
          error: `Zdjęcie „${file.name}” jest za duże (max 2,5 MB). Zmniejsz je lub zapisz jako JPG.`,
        };
      }

      const ext = resolveImageExtension(file);
      if (!ext) {
        return {
          success: false,
          error: `Nieobsługiwany format pliku „${file.name}”. Dozwolone: JPG, JPEG, JFIF, PNG, WEBP.`,
        };
      }

      preparedImages.push({
        filename: `img${index + 1}.${ext}`,
        buffer: Buffer.from(await file.arrayBuffer()),
      });
    }

    const existing = await readExistingRealizations();
    const slug = uniqueRealizationSlug(
      parsed.data.title,
      existing.map((item) => item.slug),
    );

    const realization: Realization = {
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location || undefined,
      images: preparedImages.map((image) => `/realizacje/${slug}/${image.filename}`),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const nextList = [realization, ...existing].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );

    try {
      await writeLocalFiles(realization, preparedImages, nextList);
    } catch (error) {
      console.warn("Local write skipped/failed:", error);
    }

    let published = false;

    if (isGithubPublishConfigured()) {
      await publishFilesToGithub({
        message: `Dodaj realizację: ${realization.title}`,
        files: [
          {
            path: "src/data/realizations.json",
            content: `${JSON.stringify(nextList, null, 2)}\n`,
            encoding: "utf-8",
          },
          ...preparedImages.map((image) => ({
            path: `public/realizacje/${slug}/${image.filename}`,
            content: image.buffer,
            encoding: "base64" as const,
          })),
        ],
      });
      published = true;
    }

    if (!published) {
      return {
        success: true,
        slug,
        published: false,
        message:
          "Realizacja zapisana lokalnie. Aby pojawiła się na stoly.rzeszow.pl, ustaw GITHUB_TOKEN w .env.local — wtedy kolejna publikacja pójdzie automatycznie na GitHub/Vercel.",
      };
    }

    return {
      success: true,
      slug,
      published: true,
      message:
        "Realizacja została wysłana na GitHub. Za 1–3 minuty powinna być widoczna na stoly.rzeszow.pl (po wdrożeniu Vercel).",
    };
  } catch (error) {
    console.error("addRealization error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nie udało się dodać realizacji.",
    };
  }
}
