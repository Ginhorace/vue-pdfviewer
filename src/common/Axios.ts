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

export { ocrTable, ocrText };
