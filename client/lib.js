/**
 * S-tell: приватный http-мессенджер
 * MIT License / Copyright © Вадим Тарасов, 2023
 * https://s-tell.github.io
 * https://github.com/s-tell/s-tell
*/
const serv = "http://localhost",
      salt = "ГидроортофосфатКальция";

let pubKey, privKey, nick, allKeys = [];
const elem = e => document.querySelector(e),
  enc = new TextEncoder(), dec = new TextDecoder(),
  nonce = nacl.hash(enc.encode(salt)).slice(0, nacl.box.nonceLength),
  mon = ["", "янв", "фев", "мар", "апр", "мая", "июн",
             "июл", "авг", "сен", "окт", "ноя", "дек"];

// Логотип
// =======
const logo = `
PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDEzMi4yOTIgMTMyLjI5
MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHlsZT0iZmlsbDoj
MDM2O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDouMTY4MzM2O3N0cm9r
ZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIiBkPSJNNC4z
NDYgMzEuODFoMTMyLjI5MnYxMzIuMjkySDQuMzQ2eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQu
MzQ2IC0zMS44MSkiLz48cGF0aCBzdHlsZT0iZmlsbDojMDljO2ZpbGwtb3BhY2l0eToxO3N0cm9r
ZTpub25lO3N0cm9rZS13aWR0aDouMTc2Mzg5O3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1v
cmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIiBkPSJtMTI2LjkyMyAxNjEuNzg5IDE4Ljg0IDYyLjE2
Mi0zOC4xOTItNTIuNTQtMTQuNzY2IDYzLjI1My02LjgwNC02NC41OTctNDQuNDE1IDQ3LjM5NyAy
Ni40MDctNTkuMzQ1TDUuODMgMTc2Ljk1OGw1Mi41NC0zOC4xOTFMLTQuODgyIDEyNGw2NC41OTct
Ni44MDQtNDcuMzk2LTQ0LjQxNSA1OS4zNDUgMjYuNDA2LTE4Ljg0LTYyLjE2MiAzOC4xOTIgNTIu
NTQgMTQuNzY2LTYzLjI1MyA2LjgwNCA2NC41OTdMMTU3IDQzLjUxNGwtMjYuNDA3IDU5LjM0NCA2
Mi4xNjMtMTguODM5LTUyLjU0IDM4LjE5MSA2My4yNTMgMTQuNzY2LTY0LjU5NyA2LjgwNCA0Ny4z
OTYgNDQuNDE1eiIgdHJhbnNmb3JtPSJtYXRyaXgoLjU3ODc0IC4xMTcwMyAtLjExNzAzIC41Nzg3
NCAyMy45NTIgLTIwLjk5MykiLz48L3N2Zz4=`;
document.head.innerHTML =
  document.head.innerHTML.replace("{{svg}}", logo);
document.body.innerHTML =
  document.body.innerHTML.replace("{{svg}}", atob(logo));

// Прелоадер
// =========
const preloader = `
PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NHB4IiBoZWln
aHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48Zz48cGF0aCBzdHlsZT0iZmlsbDojMDlj
O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDouMTc2Mzg5O3N0cm9rZS1s
aW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIiBkPSJtMTI2Ljky
MyAxNjEuNzg5IDE4Ljg0IDYyLjE2Mi0zOC4xOTItNTIuNTQtMTQuNzY2IDYzLjI1My02LjgwNC02
NC41OTctNDQuNDE1IDQ3LjM5NyAyNi40MDctNTkuMzQ1TDUuODMgMTc2Ljk1OGw1Mi41NC0zOC4x
OTFMLTQuODgyIDEyNGw2NC41OTctNi44MDQtNDcuMzk2LTQ0LjQxNSA1OS4zNDUgMjYuNDA2LTE4
Ljg0LTYyLjE2MiAzOC4xOTIgNTIuNTQgMTQuNzY2LTYzLjI1MyA2LjgwNCA2NC41OTdMMTU3IDQz
LjUxNGwtMjYuNDA3IDU5LjM0NCA2Mi4xNjMtMTguODM5LTUyLjU0IDM4LjE5MSA2My4yNTMgMTQu
NzY2LTY0LjU5NyA2LjgwNCA0Ny4zOTYgNDQuNDE1eiIgdHJhbnNmb3JtPSJtYXRyaXgoLjU3ODc0
IC4xMTcwMyAtLjExNzAzIC41Nzg3NCAyMy45NTIgLTIwLjk5MykiLz48YW5pbWF0ZVRyYW5zZm9y
bSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCA2NCA2NCIg
dG89Ii05MCA2NiA2NiIgZHVyPSI4MDBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5p
bWF0ZVRyYW5zZm9ybT48L2c+PC9zdmc+`;
document.body.innerHTML =
  document.body.innerHTML.replace("{{preloader}}", atob(preloader));

// Uint8Array to base58
// ====================
const A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
to_b58 = r => {
  let n, t, e, f, o = [], i= "";
  for (n in r)
    for (t=0, e=r[n], i+= e || i.length^n ? "" : 1; t in o || e;)
      f = o[t], f = f ? 256*f+e : e, e = f/58|0, o[t] = f % 58, t++;
  for(; t-- ;) i += A[o[t]];
  return i
},
from_b58 = r => {
  let n, t, e, f, o = [], i = [];
  for (n in r) {
    if (t=0, e=A.indexOf(r[n]), e<0) return;
    for (e || i.length^n || i.push(0); t in o || e;)
      f = o[t], f = f ? 58*f+e : e, e = f>>8, o[t] = f%256, t++
  }
  for(;t--;) i.push(o[t]);
  return new Uint8Array(i)
},

// Генерирование ника вида XYZ000 из публичного ключа
// =======================================================
nickGen = key => {
  let n = [], a = nacl.hash(enc.encode(key));
  for (let i=10; i<13; i++) n.push(String.fromCodePoint(a[i] % 26 + 65));
  for (let i=23; i<26; i++) n.push(a[i] % 10);
  return n.join("");
},

// Авторизация и вход в чат
// ========================
signin = async () => {
  elem("output").style.display = "none";
  privKey = elem("input").value.trim();  
  if (!privKey) {
    elem("output").style.display = "block";
    elem("output").innerHTML = "Не введён ключ";
    return
  }

  // Получение публичного ключа из приватного
  try {pubKey = to_b58(
    nacl.box.keyPair.fromSecretKey(from_b58(privKey))["publicKey"]
  )} catch (e) {
    elem("output").style.display = "block";
    elem("output").innerHTML = "Ключ некорректен";
    return
  }

  // Отправка на сервер публичного ключа для авторизации
  elem("aside").style.display = "block";
  let auth = false;
  try {
    auth = await (await fetch(`${serv}?k=${pubKey}`)).text()
  } catch (e) {
    elem("output").style.display = "block";
    elem("aside").style.display = "none";
    elem("output").innerHTML = "Ошибка сети";
    return
  }

  elem("aside").style.display = "none";
  if (auth == "auth") {   
    elem("article").style.display = "none";
    elem("main").style.display = "block";
    elem("#nick").innerHTML = (nick = nickGen(pubKey));
    elem("header span").style.display = "inline-block";

    // Получение с сервера открытых ключей пользователей
    // и заполнение select выбора адресатов поста
    let ans = await (await fetch(`${serv}?k=${pubKey}&f=getkeys`)).text();
    if (ans.includes("-")) {
      elem("select").innerHTML = `<option value="all" selected>Всем</option>`;
      allKeys = ans.split("-").filter(k => k != pubKey);
      allKeys.forEach(k => {
        elem("select").innerHTML +=
        `<option value="${k}">${nickGen(k)}</option>`;
      })
      elem("select").focus();
    } else {alert("Не удалось получить ключи с сервера"); return}

    // Загрузка постов
    get();    
  } else {
    elem("output").style.display = "block";
    elem("output").innerHTML = "В авторизации отказано";    
  }
},

// Отправка поста rcptKey.senderKey.postEncoded (ID и дата подписываются
// сервером; несколько постов для разных получателей разделяются дефисом)
// ======================================================================
send = async () => {
  // Получение текста поста и списка получателей 
  let post = elem("textarea").value.replace(/\n{2,}/g, "\n").trim(),
      rcpt = [];
  if (!post) {alert("Не введен текст поста"); return}
  post = enc.encode(post);
  document.querySelectorAll("select option:checked").forEach(
    x => rcpt.push(x.value)
  );
  rcpt = rcpt.includes("all") ? [...allKeys] : [...rcpt];
  rcpt = [...rcpt, pubKey];

  // Шифрование поста для каждого получателя его публичным ключом
  // с подписыванием своим приватным ключом и склейка в одну строку
  let bodyArray = [];
  rcpt.forEach(r => {
    let enc = to_b58(nacl.box(post, nonce, from_b58(r), from_b58(privKey)));
    bodyArray.push(`${r}.${pubKey}.${enc}`);
  });
  let body = bodyArray.join("-");
  if (body.length > 5e5-20) {alert("Превышена длина поста"); return}

  // Отправка на сервер
  let put = await (await fetch(`${serv}?k=${pubKey}&f=put`,
    {method: "POST", headers: {"Content-Type": "text/plain"}, body: body}
  )).text();
  let  mess = put == "put" ? "Пост успешно отправлен" : "Отправка не удалась",
  messColor = put == "put" ? "green" : "red";
  elem("textarea").value = mess;
  elem("textarea").style.color = messColor;
  setTimeout(() => {
    elem("textarea").value = "";
    elem("textarea").style.color = "black";
    if (put == "put") get();
  }, 3000);
},

// Получение адресованных авторизованному юзеру постов и их публикация;
// Посты разделены дефисом; один пост - это id.dt.rcptKey.senderKey.post
// У постов c одним отправителем для нескольких получателей одинаковый id
// ======================================================================
get = async () => {
  elem("aside").style.display = "block";
  let ans = await (await fetch(`${serv}?k=${pubKey}&f=get`)).text();
  if (ans == "no" || ans == "403 Forbidden") {
    elem("aside").style.display = "none";
    alert("Не удалось загрузить посты");
    return
  }
  if (ans == "get") {
    elem("aside").style.display = "none";
    elem("section").innerHTML = "<p><b>Постов нет.</b></p>";
    return
  }
  let postsGet = ans.split("-"), posts = "";
  for (let post of postsGet) {
    let [id, dt, rcpt, sender, txt] = post.split(".");
    let own = sender == pubKey ? " class='own'" : "";
    try {
      txt = dec.decode(nacl.box.open(
        from_b58(txt), nonce, from_b58(sender), from_b58(privKey)
      )).replace(/</g, "&lt;").replace(/\n/g, `</p><p${own}>`);
    } catch(e) {txt = "Невозможно расшифровать пост."}
    dt = dt.toString(); dt = dt.slice(4,6) + " " + mon[dt.slice(2,4)];
    posts += `<h2><span>[${id}]</span> <span>${dt}</span> `
           + `<span${own}>${nickGen(sender)}:</span></h2><p${own}>${txt}</p>`;
  }
  elem("aside").style.display = "none";
  elem("section").innerHTML = posts;
  elem("section").scroll(0, 1e6);
}
