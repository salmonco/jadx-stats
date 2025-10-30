import { fromArrayBuffer } from "geotiff";
import ImageStatic from "ol/source/ImageStatic";
import BaseLayer, { ImageLayerOptions } from "~/maps/layers/BaseLayer";

export interface GeoTIFFBaseLayerOptions {
  noDataValue?: number;
}

class AsyncGeoTIFFLayerFactory {
  static async createLayer(arrayBufferPromise: Promise<Response>, options: GeoTIFFBaseLayerOptions = {}, verboseName: string | null = null): Promise<BaseLayer> {
    try {
      const arrayBuffer = await (await arrayBufferPromise).arrayBuffer();
      const tiff = await fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const bbox = image.getBoundingBox();
      const width = image.getWidth();
      const height = image.getHeight();

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const rasterData = await image.readRasters();
        const [redBand, greenBand, blueBand] = rasterData;
        const noDataValue = options.noDataValue ?? 0;
        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < width * height; i++) {
          const R = redBand[i];
          const G = greenBand[i];
          const B = blueBand[i];
          imageData.data[4 * i] = R;
          imageData.data[4 * i + 1] = G;
          imageData.data[4 * i + 2] = B;
          imageData.data[4 * i + 3] = R === noDataValue && G === noDataValue && B === noDataValue ? 0 : 255;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      const dataUrl = canvas.toDataURL();
      const source = new ImageStatic({
        url: dataUrl,
        imageExtent: bbox,
      });

      const layerOptions: ImageLayerOptions = {
        ...options,
        layerType: "image",
        source,
      };

      return new BaseLayer(layerOptions, verboseName);
    } catch (error: any) {
      throw new Error("Failed to create GeoTIFF layer: " + error.message);
    }
  }
}

export default AsyncGeoTIFFLayerFactory;
