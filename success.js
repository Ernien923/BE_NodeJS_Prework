//表頭格式設定
const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-Width",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

const success = (res, todos) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      data: todos,
    }),
  );
  res.end();
};

module.exports = success;
