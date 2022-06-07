import Pica from "pica";
const pica = Pica();

export const resizeImage = async (
  img: HTMLImageElement,
  toSize: { width: number; height: number }
) => {
  try {
    const from = document.createElement("canvas");
    const ctx = from.getContext("2d");
    const safari_max = 4096;
    from.width = safari_max;
    from.height = safari_max;
    //draw just size as maximum canvas memory
    ctx?.drawImage(img, 0, 0, safari_max, safari_max);

    const to = document.createElement("canvas");
    to.width = toSize.width;
    to.height = toSize.height;

    const resizedCanvas = await pica.resize(from, to);
    const blob = await pica.toBlob(resizedCanvas, "image/jpeg", 0.9);
    return [resizedCanvas, blob];
  } catch (e) {
    console.error("error", e);
  }
  return [null, null];
};
