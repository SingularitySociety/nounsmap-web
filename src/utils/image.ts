import "pica";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pica = require("pica")();

export const resizeImage = async (
  img: object,
  toSize: { width: number; height: number }
) => {
  try {
    const to = document.createElement("canvas");
    to.width = toSize.width;
    to.height = toSize.height;

    const resizedCanvas = await pica.resize(img, to);
    const blob = await pica.toBlob(resizedCanvas, "image/jpeg", 0.9);
    return [resizedCanvas, blob];
  } catch (e) {
    console.error("error", e);
  }
  return [null, null];
};
