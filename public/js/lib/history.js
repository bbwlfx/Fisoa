export default {
  saveHistory(uid, obj) {
    const key = `fisoa_history_${uid}`;
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    if(list.length > 100) {
      list.pop();
    }
    list = list.filter(item => item.type === obj.type && item.id !== obj.id);
    list.unshift(obj);
    localStorage.setItem(key, JSON.stringify(list));
  },
  getHistory(uid) {
    const key = `fisoa_history_${uid}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return list;
  }
};
