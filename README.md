# s-tell
### Приватный http-мессенджер

Мессенджер S-tell предназначен для конфиденциального общения небольшой группы пользователей — оптимально до 10 человек, хотя формально это количество ничем не ограничено (при большем количестве участников возможно замедление работы мессенджера). Основная идея мессенджера — максимальная защита от возможного прослушивания, а также от обнаружения самого факта его использования. Именно поэтому мессенджер реализован как web-сервис, работающий по протоколу http или https, что позволяет использовать только браузер компьютера или мобильного телефона, не сохраняя факт использования мессенджера в его истории.

Мессенджер не имеет единого центрального сервера. Каждая группа пользователей самостоятельно устанавливает серверную часть мессенджера на один из бесплатных хостингов, не требующий при регистрации персональные данные. В качестве клиентской части используется html-файл и подключенные к нему js-библиотеки, запускаемые браузером локально на устройстве пользователя.

[Руководство по установке и использованию](https://s-tell.github.io/manual.html)
