import axios from 'axios';
import { TableRecogParam } from './Models';
import { ElMessage } from 'element-plus';
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    ElMessage.error({ message: error });
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
/**
 * 表格识别
 *
 */
function ocrTable(
  url: string,
  param: TableRecogParam,
  callback?: (res: any) => void,
  finalBack?: () => void
) {
  axios
    .post(url + '/TableOCR', param.toParams())
    // .post(url + '/OCR', param.toParams({ table: true, text: false }))
    .then((res) => {
      if (callback) {
        callback(res.data);
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) {
        finalBack();
      }
    });
}
/**
 * 文本识别
 * @param {Business} business
 */
function ocrText(
  url: string,
  param: TableRecogParam,
  callback?: (res: any) => void,
  finalBack?: () => void
) {
  axios
    .post(url + '/TextOCR', param.toParams())
    // .post(url + '/OCR', param.toParams({ text: true, table: false }))
    .then((res) => {
      if (callback) {
        callback(res.data);
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) {
        finalBack();
      }
    });
}
/**
 * 文本识别
 * @param {Business} business
 */
function ocrAll(
  url: string,
  param: TableRecogParam,
  callback?: (res: any) => void,
  finalBack?: () => void
) {
  axios
    .post(url + '/OCR', param.toParams())
    .then((res) => {
      if (callback) {
        callback(res.data);
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) {
        finalBack();
      }
    });
}

function commitSample(datas: any[], finalBack?: () => void) {
  axios
    .post('/api/v1/samples/samples/list', { insertVoList: datas })
    .then((res) => {
      if (res.data.status == 1001) {
        ElMessage.success({ message: res.data.message });
      } else {
        ElMessage.error({ message: res.data.message });
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}
const pageCount = 10;
function showSample(page: number, callback: (val: any) => void, finalBack?: () => void) {
  axios
    .get('/api/v1/samples/samples/show', {
      params: { sampletype: '财报图片识别', label: '识别结果', page: page, pagenum: pageCount },
    })
    .then((res) => {
      callback(res.data.data);
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}
function deleteSample(id: string, finalBack?: () => void) {
  axios
    .delete('/api/v1/samples/samples', { data: [id] })
    .then((res) => {
      if (res.data.status == 1002) {
        ElMessage.success({ message: res.data.message });
      } else {
        ElMessage.error({ message: res.data.message });
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}

function updateSample(id: string, tables: any, label?: String, finalBack?: () => void) {
  axios
    .post('/api/v1/tests/testing/updateBySingleTest', {
      sampleId: id,
      correctResult: JSON.stringify(tables),
      labels: '验收通过' + (label ? ',' + label : ''),
    })
    .then((res) => {
      if (res.data.status == 2011) {
        ElMessage.success({ message: res.data.message });
      } else {
        ElMessage.error({ message: res.data.message });
      }
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}

function saveStat(finalBack?: () => void) {
  axios
    .get('/valid/stat')
    .then((res) => {
      ElMessage.success({ message: '统计成功' });
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}
function listResult(
  page: number,
  size = 10,
  callback: (list: any) => void,
  finalBack?: () => void
) {
  axios
    .get('/valid/stat/list', {
      params: { page: page, size: size },
    })
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}
function getStatInfo(name: string, callback: (list: any) => void, finalBack?: () => void) {
  axios
    .get('/valid/stat/info', {
      params: { dir: name },
    })
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {})
    .finally(() => {
      if (finalBack) finalBack();
    });
}


export {
  ocrTable,
  ocrText,
  ocrAll,
  commitSample,
  showSample,
  deleteSample,
  updateSample,
  pageCount,
  saveStat,
  listResult,
  getStatInfo,
};
