declare module "qrcode" {
  export interface QRCodeOptions {
    version?: number;
    errorCorrectionLevel?:
      | "low"
      | "medium"
      | "quartile"
      | "high"
      | "L"
      | "M"
      | "Q"
      | "H";
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toCanvas(
    canvas: HTMLCanvasElement | string,
    text: string,
    options?: QRCodeOptions
  ): Promise<HTMLCanvasElement>;

  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export function create(text: string, options?: QRCodeOptions): any;
}
