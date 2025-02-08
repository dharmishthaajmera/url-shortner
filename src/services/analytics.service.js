const { executeQuery } = require("../../db-connect");
const {
  GET_TOTAL_URL_ACCESS_FOR_ALIAS,
  GET_DISTINCT_USERCOUNT_FOR_URL,
  GET_CLICK_COUNT_FOR_PAST_SEVEN_DAYS,
  GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_OS_TYPE,
  GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_DEVICE,
  GET_URLS_BY_TOPIC_QUERY,
  GET_CLICKS_BY_DATE_FOR_TOPIC_QUERY,
  GET_URLS_BY_USER_QUERY,
  GET_CLICKS_BY_DATE_FOR_USER_QUERY,
  GET_OS_TYPE_ANALYTICS_QUERY,
  GET_DEVICE_TYPE_ANALYTICS_QUERY,
} = require("../helpers/queries");

const fetchUrlAnalytics = async (alias) => {
  // Fetch total clicks and unique users
  const totalClicksQuery = GET_TOTAL_URL_ACCESS_FOR_ALIAS;
  const uniqueUsersQuery = GET_DISTINCT_USERCOUNT_FOR_URL;

  // Fetch clicks by date for the last 7 days
  const clicksByDateQuery = GET_CLICK_COUNT_FOR_PAST_SEVEN_DAYS;

  // Fetch OS and device type statistics
  const osTypeQuery = GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_OS_TYPE;

  const deviceTypeQuery = GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_DEVICE;

  // Execute all queries in parallel
  const [
    totalClicksResult,
    uniqueUsersResult,
    clicksByDateResult,
    osTypeResult,
    deviceTypeResult,
  ] = await Promise.all([
    executeQuery(totalClicksQuery, [alias]),
    executeQuery(uniqueUsersQuery, [alias]),
    executeQuery(clicksByDateQuery, [alias]),
    executeQuery(osTypeQuery, [alias]),
    executeQuery(deviceTypeQuery, [alias]),
  ]);

  return {
    totalClicks: parseInt(totalClicksResult[0].count),
    uniqueUsers: parseInt(uniqueUsersResult[0].count),
    clicksByDate: clicksByDateResult,
    osType: osTypeResult,
    deviceType: deviceTypeResult,
  };
};

const fetchTopicAnalytics = async (topic) => {
  // Fetch URLs under the topic
  const urlsQuery = GET_URLS_BY_TOPIC_QUERY;

  // Fetch clicks by date for the last 7 days across all URLs under the topic
  const clicksByDateQuery = GET_CLICKS_BY_DATE_FOR_TOPIC_QUERY

  // Execute all queries in parallel
  const [urlsResult, clicksByDateResult] = await Promise.all([
    executeQuery(urlsQuery, [topic]),
    executeQuery(clicksByDateQuery, [topic]),
  ]);

  return {
    totalClicks: urlsResult.reduce(
      (sum, url) => sum + parseInt(url.total_clicks),
      0
    ),
    uniqueUsers: urlsResult.reduce(
      (sum, url) => sum + parseInt(url.unique_users),
      0
    ),
    clicksByDate: clicksByDateResult,
    urls: urlsResult.map((url) => ({
      shortUrl: `${process.env.BASE_URL}/${url.alias}`,
      totalClicks: parseInt(url.total_clicks),
      uniqueUsers: parseInt(url.unique_users),
    })),
  };
};

const fetchOverallAnalytics = async (userId) => {
  // Fetch all short URLs created by the user
  const urlsQuery = GET_URLS_BY_USER_QUERY;

  // Fetch clicks by date for the last 7 days for all URLs created by the user
  const clicksByDateQuery = GET_CLICKS_BY_DATE_FOR_USER_QUERY;

  // Fetch OS and device type analytics
  const osTypeQuery = GET_OS_TYPE_ANALYTICS_QUERY;

  const deviceTypeQuery = GET_DEVICE_TYPE_ANALYTICS_QUERY;

  // Execute all queries in parallel
  const [urlsResult, clicksByDateResult, osTypeResult, deviceTypeResult] =
    await Promise.all([
      executeQuery(urlsQuery, [userId]),
      executeQuery(clicksByDateQuery, [userId]),
      executeQuery(osTypeQuery, [userId]),
      executeQuery(deviceTypeQuery, [userId]),
    ]);

  return {
    totalUrls: urlsResult.length,
    totalClicks: urlsResult.reduce(
      (sum, url) => sum + parseInt(url.total_clicks),
      0
    ),
    uniqueUsers: urlsResult.reduce(
      (sum, url) => sum + parseInt(url.unique_users),
      0
    ),
    clicksByDate: clicksByDateResult,
    osType: osTypeResult,
    deviceType: deviceTypeResult,
  };
};

module.exports = {
  fetchUrlAnalytics,
  fetchTopicAnalytics,
  fetchOverallAnalytics,
};
