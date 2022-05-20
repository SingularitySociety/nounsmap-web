import osmsm from "osm-static-maps";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import UUID from "uuid-v4";

export const downloadMapImage = async (lat, lng, zoom) => {
  const tmpMap = path.join(os.tmpdir(), UUID()) + ".png";
  const imageBinaryBuffer = await osmsm({
    width: 600, // 画像の横幅(ピクセル) twitter recommend 600
    height: 314, // 画像の縦幅(ピクセル) twitter recommend 314
    center: lng + "," + lat, // 経度,緯度
    zoom: zoom, // ズームレベル
    type: "png", // PNG 画像フォーマット
  });
  // 地図画像データをファイルに出力
  await fs.promises.writeFile(tmpMap, imageBinaryBuffer);
  return tmpMap;
};
