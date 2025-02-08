const yup = require("yup");
const { validator } = require("../helpers/validator");

const shortenUrl = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      longUrl: yup
        .string()
        .url("Must be a valid URL")
        .required("Long URL is required"),
      customAlias: yup
        .string()
        .matches(
          /^[a-zA-Z0-9_-]{3,20}$/,
          "Custom alias must be between 3-20 characters and can contain letters, numbers, hyphens, and underscores"
        )
        .notRequired(),
      topic: yup
        .string()
        .min(3, "Topic must be at least 3 characters long")
        .max(100, "Topic cannot be longer than 100 characters"),
    }),
  });
  validator(req, res, schema, next);
};

const urlAlias = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      alias: yup
        .string()
        .matches(
          /^[a-zA-Z0-9_-]{3,20}$/,
          "Alias must be between 3-20 characters and can contain letters, numbers, hyphens, and underscores"
        )
        .required("Alias is required"),
    }),
  });
  validator(req, res, schema, next);
};

module.exports = { shortenUrl, urlAlias };
