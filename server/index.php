<?php
/**
 * S-tell: приватный http-мессенджер
 * MIT License / Copyright © Вадим Тарасов, 2023
 * https://s-tell.github.io
 * https://github.com/s-tell/s-tell
*/
$dbFileName = "2byetmyxoo2g3rv805t8h5jh.txt";
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

// Получение пришедших от клиента данных
$func = $key = $post = "no";
if (@$_GET["f"]) $func = substr($_GET["f"], 0, 10);
if (@$_GET["k"]) $key  = substr($_GET["k"], 0, 50);
if (@$postInp = file_get_contents("php://input"))
  $post = substr($postInp, 0, 5e5);
$patt = "/^[a-zA-Z0-9-.]+$/";
if (!preg_match($patt, $func) ||
    !preg_match($patt, $key)  ||
    !preg_match($patt, $post)
) die("403 Forbidden");

// Авторизация пользователя и формирование массива открытых ключей
$keys = array_slice(explode("\n", trim(file_get_contents("keys.php"))),1,-1);
foreach ($keys as $i => $k) {$keys[$i] = trim($keys[$i]);}
$auth = false;
foreach ($keys as $k) {
  if(!$k) continue;
  if ($k == $key) {$auth = true; break;}
}
if (!$auth) die("403 Forbidden");

// Подключение к базе данных и создание таблицы постов
if (!file_exists($dbFileName)) {
  $db = new SQLite3($dbFileName);
  $q = "CREATE TABLE posts"
     . "(id TEXT, dt INTEGER, rcpt TEXT, sender TEXT, post TEXT)";
  $db->query($q);
} else $db = new SQLite3($dbFileName);

switch ($func) {
  // Выдача открытых ключей пользователей (разделитель - дефис)
  case "getkeys":
  echo join("-", $keys);
  break;

  // Публикация постов
  case "put":
  if ($post == "no") die("no");
  $newPosts = explode("-", $post);
  $id = base_convert(substr(md5(time().$key), 0, 12), 16, 36);
  $dt = gmdate("ymd");
  $db->exec("BEGIN");
  foreach ($newPosts as $cPost) {
    $postAll = explode(".", $cPost);
    $rcpt = $postAll[0];
    $sender = $postAll[1];
    $post = $postAll[2];    
    $q = "INSERT INTO posts (  id,    dt,    rcpt,    sender,    post) "
       .            "VALUES ('$id', '$dt', '$rcpt', '$sender', '$post')";
    $result = $db->exec($q);
    if (!$result) die("no");    
  }
  $db->exec("COMMIT");
  echo "put";
  break;

  // Выдача постов, адресованных авторизованному пользователю
  // с предварительным удалением из базы все постов старше 10 суток
  case "get":
  // Удаление старых постов 
  $old = gmdate("ymd", time() - 864e3);
  $db->exec("BEGIN");
  $q = "DELETE from posts WHERE (dt < $old)";
  $result = $db->exec($q);
  if (!$result) die("no");
  $db->exec("COMMIT");

  // Выдача постов пользователю (поля разделены точкой, посты - дефисом)
  // Один пост - это id.dt.rcpt.sender.post
  $q = "SELECT * from posts WHERE (rcpt = '$key')";
  $get = "";
  $result = $db->query($q);
  if (!$result) die("no");
  while($res = $result->fetchArray(SQLITE3_ASSOC)) {
    $get .= "-".$res["id"].".".$res["dt"].".".$res["rcpt"]
          . ".".$res["sender"].".".$res["post"];
  }
  $get = $get ? $get : "-get";
  echo substr($get, 1);
  break;

  // Выдача результата положительной авторизации
  default: {sleep(2); echo "auth";}
}
?>