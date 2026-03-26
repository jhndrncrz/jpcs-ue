declare module 'html-to-image' {
  export function toPng(node: Node, options?: any): Promise<string>;
  export function toJpeg(node: Node, options?: any): Promise<string>;
  export function toBlob(node: Node, options?: any): Promise<Blob>;
  export function toCanvas(node: Node, options?: any): Promise<HTMLCanvasElement>;
  export function toSvg(node: Node, options?: any): Promise<string>;
}
