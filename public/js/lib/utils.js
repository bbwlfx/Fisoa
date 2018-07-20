import 'babel-polyfill';
import Signin from 'components/signin/';

const generateData = function(data) {
  return Object.keys(data).map((key) => {
    if(data[key] === true) {
      return `${encodeURIComponent(key)}`;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
  }).join('&');
};

const utils = {
  className(obj) {
    const set = new Set();
    if(!Array.isArray(obj)) {
      obj = [obj];
    }
    obj.forEach((o) => {
      if(typeof o === 'string') {
        set.add(o);
      } else {
        Object.keys(o).forEach((key) => {
          if(o[key]) {
            set.add(key);
          }
        });
      }
    });
    return Array.from(set.values()).join(' ');
  },
  bindMethods(methods, obj) {
    methods.forEach((method) => {
      if(typeof obj[method] === 'function') {
        obj[method] = obj[method].bind(obj);
      } else {
        console.warn(`This Object don't own the method [${method}], please remove it from the methods list`);
      }
    });
  },
  fetch(url, config) {
    config = config || {};
    let fetchConfig = {
      method: config.method || 'GET',
      credentials: 'same-origin'
    };
    let promise = null;
    if(config.data && ['GET', 'DELETE'].indexOf(fetchConfig.method) >= 0) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + generateData(config.data);
    }
    if(['POST', 'PUT', 'PATCH'].indexOf(config.method) >= 0) {
      if(window.FormData && config.data instanceof FormData) {
        fetchConfig = Object.assign(fetchConfig, {
          body: config.data,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
      } else {
        fetchConfig = Object.assign(fetchConfig, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(config.data)
        });
      }
    }
    if(config.download) {
      fetchConfig.headers = {
        'Content-Type': 'text/csv; charset=UTF-8'
      };
    }
    const timer = new Promise((resolve, reject) => {
      setTimeout(() => {
      /* eslint-disable */
        reject({
          data: {
            msg: 'netWorkError'
          }
        });
      /* eslint-enable */
      }, config.timeout || 10000);
    });
    promise = new Promise((resolve, reject) => {
      fetch(url, fetchConfig).then((response) => {
        const { status } = response;
        if(status >= 400) {
          return response.text().then((error = 'Unknown Error!') => Promise.reject(error));
        }
        return response.json();
      }).then((json) => {
        if(json.type === 103) {
          // 用户未登录
          Signin.show();
        }
        resolve(json);
      }, (error) => {
        reject(error);
      });
    });
    return Promise.race([promise, timer]);
  },
  formatNumber(n) {
    if(typeof n !== 'number') {
      return n;
    }
    if(n < 1000) {
      return n;
    }
    const number = n / 1000;
    return `${number.toFixed(2)}k`;
  },
  formatString(string, ...params) {
    return string.replace(/{(\d)}/g, ($, $1) => params[$1]);
  },
  logEvent(evnet_name, event_params) {
    const eventParams = Object.assign({}, event_params, {
      platform: window.__platform__,
      browser: window.__browser__,
      browserVersion: window.__browserVersion__
    });
    window.amplitudeEnable && window.amplitude.getInstance().logEvent(evnet_name, eventParams);
  },
  splitSearch(location) {
    const { search } = location;
    location.query = {};
    if(!search) {
      return;
    }
    search.replace('?', '').split('&').forEach((entry) => {
      const [key, value] = entry.split('=');
      location.query[key] = value;
    });
  }
};

export default utils;
