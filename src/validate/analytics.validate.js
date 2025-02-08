const yup = require("yup");
const { validator } = require("../helpers/validator");

const aliasAnalytics = async (req, res, next) => {
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

const topicAnalytics = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
    topic: yup
      .string()
      .min(3, "Topic must be at least 3 characters long")
      .max(100, "Topic cannot be longer than 100 characters")
      .required("Topic is required"),
    })
  });
  validator(req, res, schema, next);
};

const overallAnalytics = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
    userId: yup
      .number()
      .positive("User ID must be a positive number")
      .required("User ID is required"),
    })
  });
  validator(req, res, schema, next);
};

module.exports = { aliasAnalytics, topicAnalytics, overallAnalytics };
