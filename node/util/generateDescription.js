const DESCRIPTION_LENGTH = 140;
module.exports = (obj) => {
  let { content } = obj;
  if(typeof content !== 'object') {
    content = JSON.parse(content);
  }
  let desc = '';
  content.blocks.map((item) => {
    if(desc.length + item.text.length < DESCRIPTION_LENGTH) {
      desc += item.text;
    } else if(desc.length < DESCRIPTION_LENGTH) {
      desc += item.text.slice(0, DESCRIPTION_LENGTH - desc.length);
    }
    return item;
  });
  return desc;
};
