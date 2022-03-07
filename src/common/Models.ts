class PdfRange {
  startPage: number;
  endPage: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  constructor() {
    this.startPage = 1;
    this.endPage = 1;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
  }
}
class Region {
  P0: number[];
  P1: number[];
  P2: number[];
  P3: number[];
  constructor() {
    this.P0 = [0, 0];
    this.P1 = [0, 0];
    this.P2 = [0, 0];
    this.P3 = [0, 0];
  }
  static scale(region: Region, scale: number) {
    let res = new Region();
    res.P0[0] = region.P0[0] * scale;
    res.P0[1] = region.P0[1] * scale;
    res.P1[0] = region.P1[0] * scale;
    res.P1[1] = region.P1[1] * scale;
    res.P2[0] = region.P2[0] * scale;
    res.P2[1] = region.P2[1] * scale;
    res.P3[0] = region.P3[0] * scale;
    res.P3[1] = region.P3[1] * scale;
    return res;
  }
}
class DrawRect {
  region: Region;
  type: string;
  color: string;
  constructor(region: any, type: string, color: string = '') {
    this.region = region;
    this.type = type;
    this.color = color;
  }
}

class TableRecogParam {
  toParams(option?: { table?: boolean; text?: boolean }): any {
    return {
      Img: this.image.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', ''),
      BizModel: this.bizModel.id,
      Enables: {
        // Font: this.bizModel.font,
        // TableHead: this.bizModel.tableHead,
        // TiltCorrection: this.bizModel.tiltCorrection,
        // RmSealWhenCut: this.bizModel.rmSealWhenCut,
        // RmSealWhenOCR: this.bizModel.rmSealWhenOCR,
        // SubjectMode: this.bizModel.fiRecMode,
        // Number: this.bizModel.number,
        // TextcellCut: false,
        // ColorImage: this.bizModel.colorImage,
        // Extend: false,
        Table: option?.table,
        Text: option?.text,
      },
    };
  }
  image: string;
  bizModel: Enables;
  constructor() {
    this.image = '';
    this.bizModel = new Enables();
  }
}
class Enables {
  name: string;
  id: string;
  font: boolean;
  tableHead: boolean;
  tiltCorrection: boolean;
  rmSealWhenCut: boolean;
  rmSealWhenOCR: boolean;
  fiRecMode: boolean;
  number: boolean;
  colorImage: boolean;
  constructor(enbables?: Enables) {
    this.name = enbables?.name ?? '通用';
    this.id = enbables?.id ?? '';
    this.font = enbables?.font ?? false;
    this.tableHead = enbables?.tableHead ?? false;
    this.tiltCorrection = enbables?.tiltCorrection ?? true;
    this.rmSealWhenCut = enbables?.rmSealWhenCut ?? false;
    this.rmSealWhenOCR = enbables?.rmSealWhenOCR ?? false;
    this.fiRecMode = enbables?.fiRecMode ?? false;
    this.number = enbables?.number ?? false;
    this.colorImage = enbables?.colorImage ?? false;
  }
  static fiReport(): Enables {
    var res = new Enables();
    res.name = '财报主表';
    res.id = 'fi-report';
    res.tableHead = true;
    res.tiltCorrection = true;
    res.rmSealWhenCut = true;
    res.rmSealWhenOCR = false;
    res.fiRecMode = true;
    return res;
  }
}
const allBiz: Enables[] = [new Enables(), Enables.fiReport()];
const allService = [
  {
    name: 'FDC-开发站',
    url: '/fdc',
  },
  {
    name: 'FDC-正式站',
    url: '/fdc-prod',
  },
  {
    name: 'BDC',
    url: '/bdc',
  },
];
const tableOption = ['位置正确', '切割错误', '定位错误'];

const imageType = ['WFT表格', '财报附表', '财报主表'];
export {
  PdfRange,
  Region,
  TableRecogParam,
  DrawRect,
  Enables,
  allBiz,
  allService,
  tableOption,
  imageType,
};
