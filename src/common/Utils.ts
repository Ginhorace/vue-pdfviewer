import { DrawRect, Region } from './Models';

/**
 * 划线表格框选区域
 */
function drawLine(rect: DrawRect, canvas: HTMLCanvasElement, scale: number) {
  if (!rect || !rect.region) {
    return;
  }
  let ctx = canvas.getContext('2d');
  let region = Region.scale(rect.region, scale);
  if (ctx) {
    ctx.globalCompositeOperation = 'source-over';
    let paths = new Path2D();
    if (rect.type == 'vertical') {
      ctx.strokeStyle = '#ff0000';
      if (rect.color) {
        ctx.strokeStyle = rect.color;
      }
      paths.lineTo(region.P1[0], region.P1[1]);
      paths.lineTo(region.P2[0], region.P2[1]);
      ctx.stroke(paths);
      paths = new Path2D();
      paths.lineTo(region.P3[0], region.P3[1]);
      paths.lineTo(region.P0[0], region.P0[1]);
      ctx.stroke(paths);
    }
    if (rect.type == 'horizontal') {
      ctx.strokeStyle = '#ff0000';
      if (rect.color) {
        ctx.strokeStyle = rect.color;
      }
      paths.lineTo(region.P0[0], region.P0[1]);
      paths.lineTo(region.P1[0], region.P1[1]);
      ctx.stroke(paths);
      paths = new Path2D();
      paths.lineTo(region.P2[0], region.P2[1]);
      paths.lineTo(region.P3[0], region.P3[1]);
      ctx.stroke(paths);
    }
    if (rect.type == 'cell') {
      ctx.strokeStyle = '#0000ff';
      if (rect.color) {
        ctx.strokeStyle = rect.color;
      }
      paths.lineTo(region.P0[0], region.P0[1]);
      paths.lineTo(region.P1[0], region.P1[1]);
      paths.lineTo(region.P2[0], region.P2[1]);
      paths.lineTo(region.P3[0], region.P3[1]);
      paths.lineTo(region.P0[0], region.P0[1]);
      ctx.stroke(paths);
    }
  }
}

/**
 * 根据区域切割图片
 * @param image
 * @param textline
 * @param region
 */
function clip(image: HTMLImageElement, region: Region) {
  let rect = getRect(region);
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = rect[2];
  canvas.height = rect[3];
  ctx?.drawImage(image, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
  return canvas.toDataURL('image/jpeg');
}
/**
 * 根据四点区域获得矩形
 */
function getRect(region: Region) {
  let minX = Math.min(region.P0[0], region.P1[0], region.P2[0], region.P3[0]);
  let minY = Math.min(region.P0[1], region.P1[1], region.P2[1], region.P3[1]);
  let maxX = Math.max(region.P0[0], region.P1[0], region.P2[0], region.P3[0]);
  let maxY = Math.max(region.P0[1], region.P1[1], region.P2[1], region.P3[1]);
  return [minX, minY, maxX - minX, maxY - minY];
}
export { drawLine, clip, getRect };
