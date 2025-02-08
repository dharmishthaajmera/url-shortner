module.exports = {
  GET_USER_WITH_ID: `SELECT * FROM user_details WHERE user_id = $1`,

  ADD_USER: `INSERT INTO user_details(user_id, email, name) VALUES($1, $2, $3) RETURNING *`,

  INSERT_AUTH_TOKEN: `INSERT INTO auth_token(user_id, id_token, expiry_time) VALUES($1, $2, $3)`,

  GET_AUTH_TOKEN: `SELECT * FROM auth_token WHERE user_id = $1 AND expiry_time > NOW()`,

  DELETE_EXISTING_SESSION: `DELETE FROM auth_token WHERE user_id = $1`,

  GET_URL_BY_CUSTOM_ALIAS: `SELECT * FROM short_urls WHERE alias = $1`,

  INSERT_SHORTEN_URL: `INSERT INTO short_urls (long_url, alias, topic, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,

  GET_ALIAS_COUNT_FOR_USER_FOR_LONG_URL: `SELECT COUNT(*) AS aliasCount FROM short_urls WHERE long_url = $1 AND topic = $2 AND user_id = $3`,

  INSERT_URL_ANALYTICS_ON_ACCESS: `INSERT INTO url_analytics (alias, ip_address, user_agent, country, region, city, timestamp) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,

  GET_TOTAL_URL_ACCESS_FOR_ALIAS: `SELECT COUNT(*) FROM url_analytics WHERE alias = $1`,

  GET_DISTINCT_USERCOUNT_FOR_URL: `SELECT COUNT(DISTINCT ip_address) FROM url_analytics WHERE alias = $1`,

  GET_CLICK_COUNT_FOR_PAST_SEVEN_DAYS: `SELECT DATE(timestamp) as date, COUNT(*) as click_count 
    FROM url_analytics 
    WHERE alias = $1 AND timestamp > NOW() - INTERVAL '7 days' 
    GROUP BY DATE(timestamp)
    ORDER BY date DESC`,

  GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_OS_TYPE: `SELECT os_name, COUNT(DISTINCT ip_address) as unique_users, 
    COUNT(*) as unique_clicks
    FROM url_analytics 
    WHERE alias = $1
    GROUP BY os_name`,

  GET_UNIQUE_USER_AND_CLICK_COUNT_FOR_DEVICE: `SELECT device_name, COUNT(DISTINCT ip_address) as unique_users, 
    COUNT(*) as unique_clicks
    FROM url_analytics 
    WHERE alias = $1
    GROUP BY device_name`,

  GET_URLS_BY_TOPIC_QUERY: `
    SELECT short_urls.alias, long_url, COUNT(*) AS total_clicks, COUNT(DISTINCT ip_address) AS unique_users
    FROM short_urls
    LEFT JOIN url_analytics ON short_urls.alias = url_analytics.alias
    WHERE topic = $1
    GROUP BY short_urls.alias, long_url
`,

  GET_CLICKS_BY_DATE_FOR_TOPIC_QUERY: `
    SELECT DATE(timestamp) as date, COUNT(*) as click_count
    FROM url_analytics
    WHERE alias IN (SELECT alias FROM short_urls WHERE topic = $1)
    AND timestamp > NOW() - INTERVAL '7 days'
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
`,

  GET_URLS_BY_USER_QUERY: `
  SELECT short_urls.alias, COUNT(*) AS total_clicks, COUNT(DISTINCT ip_address) AS unique_users
  FROM short_urls
  LEFT JOIN url_analytics ON short_urls.alias = url_analytics.alias
  WHERE user_id = $1
  GROUP BY short_urls.alias
`,

  GET_CLICKS_BY_DATE_FOR_USER_QUERY: `
  SELECT DATE(timestamp) as date, COUNT(*) as click_count
  FROM url_analytics
  WHERE alias IN (SELECT alias FROM short_urls WHERE user_id = $1)
  AND timestamp > NOW() - INTERVAL '7 days'
  GROUP BY DATE(timestamp)
  ORDER BY date DESC
`,

  GET_OS_TYPE_ANALYTICS_QUERY: `
  SELECT os_name, COUNT(DISTINCT ip_address) as unique_users, COUNT(*) as unique_clicks
  FROM url_analytics
  WHERE alias IN (SELECT alias FROM short_urls WHERE user_id = $1)
  GROUP BY os_name
`,

  GET_DEVICE_TYPE_ANALYTICS_QUERY: `
  SELECT device_name, COUNT(DISTINCT ip_address) as unique_users, COUNT(*) as unique_clicks
  FROM url_analytics
  WHERE alias IN (SELECT alias FROM short_urls WHERE user_id = $1)
  GROUP BY device_name
`,
};
