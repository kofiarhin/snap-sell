const slugify = require("slugify");

const createSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });

const createUniqueSlug = async (Model, text, existingId = null) => {
  let slug = createSlug(text);
  let counter = 0;
  let candidate = slug;

  while (true) {
    const query = { slug: candidate };
    if (existingId) query._id = { $ne: existingId };
    const exists = await Model.findOne(query).lean();
    if (!exists) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
};

module.exports = { createSlug, createUniqueSlug };
