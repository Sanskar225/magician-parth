const slugify = require('slugify');

exports.createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

exports.createUniqueSlug = async (model, text, field = 'slug') => {
  let slug = exports.createSlug(text);
  let uniqueSlug = slug;
  let counter = 1;
  
  while (await model.findOne({ where: { [field]: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
};