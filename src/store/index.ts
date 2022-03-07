import { DrawRect } from 'common/Models';
import { createStore } from 'vuex';
import MyWorker from 'pdfjs-dist/build/pdf.worker.js?worker';
const store = createStore({
  state() {
    return {
      image: '',
      imageElement: undefined,
      file: '',
      pdfWorker: new MyWorker(),
      confidenceThreshold: 0.5,
      uuid: '',
      drawRect: [],
      selectedCell: '',
      tableResult: '',
      textResult: '',
      showHeader: '',
      showImage: '',
    };
  },
  getters: {
    isPdf(state: any) {
      switch (state.file?.type) {
        case 'application/pdf':
          return true;
        case 'image/png':
          return false;
        case 'image/jpeg':
          return false;
        default:
          return false;
      }
    },
  },
  mutations: {
    uploadFile(state: any, file: File) {
      state.file = file;
    },
    setImage(state: any, image: string) {
      if (state.image != image) {
        state.tableResult = '';
        state.textResult = '';
        state.uuid = '';
      }
      state.image = image;
      state.imageElement = new Image();
      state.imageElement.src = state.image;
    },
    setImageWithResult(state: any, image: string) {
      state.image = image;
      state.imageElement = new Image();
      state.imageElement.src = state.image;
    },
    setRequestUuid(state: any, uuid: string) {
      state.uuid = uuid;
    },
    setConfidenceThreshold(state: any, val: number) {
      state.confidenceThreshold = val;
    },
    setDrawRect(state: any, val: DrawRect[]) {
      state.drawRect = val;
    },
    selectCell(state: any, val: any) {
      state.selectedCell = val;
    },
    setTableResult(state: any, val: any) {
      state.tableResult = val;
    },
    setTextResult(state: any, val: any) {
      state.textResult = val;
    },
    setShowHeader(state: any, val: any) {
      state.showHeader = val;
    },
    setShowImage(state: any, val: any) {
      state.showImage = val;
    },
  },
});
export default store;
