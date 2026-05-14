const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");
const success = require("./success");

//待辦事項陣列
const todos = [];

//表頭格式設定
const headers = {
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-Width",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

const requestHandle = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  // GET
  if (req.url === "/todos" && req.method === "GET") {
    success(res, todos);
  }

  // POST
  else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        // 檢查是否包含 title 屬性
        if (title !== undefined) {
          todos.push({
            title: title,
            id: uuidv4(),
          });
          success(res, todos);
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }

  // PATCH
  else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const patchTodoId = req.url.split("/").pop(); // 取得要修改的待辦 id
        const patchTodoIndex = todos.findIndex(
          (todo) => todo.id === patchTodoId,
        ); //判斷要修改的 todo id 索引位置
        if (title !== undefined && patchTodoId !== -1) {
          todos[patchTodoIndex].title = title;
          success(res, todos);
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }

  // DELETE (刪除全部)
  else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    success(res, todos);
  }

  // DELETE (刪除單筆)
  else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const delTodoId = req.url.split("/").pop(); // 取得要刪除的待辦 id
    const delTodoIndex = todos.findIndex((todo) => todo.id === delTodoId); //判斷要刪除的 todo id 索引位置
    // 判斷 id 是否存在 (-1代表不存在)
    if (delTodoIndex !== -1) {
      todos.splice(delTodoIndex, 1);
      success(res, todos);
    } else {
      errorHandle(res);
    }
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此路由",
      }),
    );
    res.end();
  }
};

http.createServer(requestHandle).listen(process.env.PORT || 8080);
