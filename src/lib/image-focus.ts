import type { ImageFocus } from "@/types/product";

export const IMAGE_FOCUS_BY_SLUG: Record<string, ImageFocus> = {
  // pełny dół – było OK
  stol_v: "bottom",
  pajak_8_nog: "bottom",
  pajak_wykrecany: "bottom",
  // lekko za wysoko → miękkie przesunięcie
  pajak: "soft",
  rama_prostokat: "soft",
  kacper_2d_motyl: "soft",
  kolo_lamele: "soft",
  // mocno za wysoko → bliżej środka
  prostokat_l_prosta: "mid",
  rama_8x8: "mid",
  y: "mid",
  // minimalnie za nisko → lekkie uniesienie
  kaczka: "slight",
};

/** Tylko konkretne zdjęcia – podniesienie kadru */
export const IMAGE_FOCUS_BY_PATH: Record<string, ImageFocus> = {
  "/oferta/prostokat_l_prosta/img4.webp": "bottom",
  "/oferta/kolo_x_2d/img3.webp": "bottom",
  "/oferta/kolo_x_2d/img5.webp": "bottom",
  "/oferta/rama_8x8/img4.png": "bottom",
  "/oferta/rama_bez_poprzeczki/img3.webp": "bottom",
  "/oferta/rama_bez_poprzeczki/img4.webp": "bottom",
};

export function resolveImageFocus(
  imagePath: string,
  productDefault: ImageFocus = "center",
  overrides: Record<string, ImageFocus> = {},
): ImageFocus {
  return overrides[imagePath] ?? IMAGE_FOCUS_BY_PATH[imagePath] ?? productDefault;
}
