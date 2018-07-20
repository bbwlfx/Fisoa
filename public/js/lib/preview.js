const ss = sessionStorage;

export default {
  saveInfo(id, obj) {
    const key = `fisoa_preview_${id}`;
    if(typeof obj === 'object') {
      obj = JSON.stringify(obj);
    }
    ss.setItem(key, JSON.stringify(obj));
  },
  getInfo(id) {
    const key = `fisoa_preview_${id}`;
    return JSON.parse(ss.getItem(key) || '{}');
  }
};
