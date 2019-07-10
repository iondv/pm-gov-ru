# IONDV. Project-management

**IONDV. Project-management** - is a web enterprise application based on IONDV. Framework. 
Project management system allows you to organize project activities: to monitor the results, 
to comply with and reduce the deadlines, to use effectively temporary, human and 
financial resources, making timely and informed management decisions. It's mainly designed for Russian regional government sector.

The app is free for everyone but available only in russian. 

Watch a brief [video](https://www.youtube.com/watch?v=AsY2D5quPQs&feature=youtu.be) about **IONDV. Project-management** (available only in russian).

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/images/pm2.png" alt="IONDV. Project-management" align="center"></a>
</h1>  

## Описание  

**IONDV. Project-management** - это программное решение на основе IONDV. Framework, реализованное для организации проектной деятельности, целью которой является контроль результатов, соблюдение и сокращение сроков их достижения, эффективное использование временных, человеческих и финансовых ресурсов, принятие своевременных и обоснованных управленческих решений.

Повышение качества управления проектами и увеличение коэфициента успешных проектов позволят уложиться во временные и бюджетные рамки. Для руководителя система становится инструментом контроля загруженности сотрудников при работе над проектом, что позволяет экономно распределить ресурсы на приоритетный или отстающий по срокам проект. 
Охват целой картины проекта позволяет своевременно среагировать и принять верное управленческое решение. 

Смотрите краткое [видео](https://www.youtube.com/watch?v=AsY2D5quPQs&feature=youtu.be) об использовании **IONDV. Project-management**.

<a href="https://www.youtube.com/watch?v=AsY2D5quPQs&feature=youtu.be" target="_blank"><img src="/images/IONDV.PM_video.png" height="250px" alt="Project-management"></a>

### Что включает система?

* Учет проектов и мероприятий
* Разделение прав и безопасности
* Бюджетирование
* Мониторинг объектов
* Визуализация географических данных
* Печатные формы
* Сбор отчетной информации
* График ганта
* Хранение файлов в opensource файловом хранилище [Nextcloud](https://nextcloud.com), с возможностью подключения бесплатной версии [collabora online](https://www.collaboraoffice.com/) для совместного редактирования документов

### Дополнительные преимущества:

* Доступ в тестовую систему для ознакомления;
* Открытый исходный код Системы;
* Открытое программное обеспечение для СУБД и серверных ОС;
* Облачное хранилище файлов проектной документации; 
* Адаптация системы к потребностям заказчикам.

### Модули

Основу реестра данных составляет [модуль Регистри](https://github.com/iondv/registry). 

Также использовались:  
* [Административный модуль](https://github.com/iondv/ionadmin), 
* [модуль Портала](https://github.com/iondv/portal), 
* [модуль Дашборда](https://github.com/iondv/dashboard), 
* [модуль Отчетов](https://github.com/iondv/report), 
* [Геомодуль](https://github.com/iondv/geomap), 
* [модуль Диаграммы Ганта](https://github.com/iondv/gantt-chart).

## Как получить?  

### Демо

Демо доступ в систему для ознакомления, без регистрации: https://pm-gov-ru.iondv.com

Учетная запись администратора для [бек-офиса](https://pm-gov-ru.iondv.com/registry): пользователь **demo**, пароль **ion-demo**. 
Учетная запись с ограниченными правами оператора (создание проектов и динамические права на основе способа участия в проектах - 
подробнее смотрите [Руководство пользователя](manuals/RP_pm.docx)): пользователь **operator**, пароль **ion-demo**

Демо включает в себя модуль Гантта и иерархическое представление справочников показателей (TreeGrid из дополнительного приложения viewlib-extra) в ряде объектов. К сожалению эти модули содержат проприетарные компоненты и поэтому не опубликованы на [github](https://github.com/iondv) , соответственно версия приложения и публичный докер контейнер их не содержат. Их можно получить по запросу в https://iondv.com/portal/enterprise.

### Gitclone

Быстрый старт с использованием репозитория IONDV. Project-management на GitHub — [подробная инструкция](https://github.com/iondv/framework/blob/master/docs/ru/readme.md#быстрый-старт-с-использованием-репозитория).  

1. Установите системное окружение и глобальные зависимости, включая nextcloud
2. Клонируйте ядро, модуль и приложение.
3. Соберите и разверните приложение.
4. Запустите.

Или установка и запуск в несколько строку под Linux с использованием установщика [iondv-app](https://github.com/iondv/iondv-app) (требуется локально node.js, MongoDB и Git). Дополнительно требуется nextcloud
```
bash <(curl -sL https://raw.githubusercontent.com/iondv/iondv-app/master/iondv-app) -q -i -m localhost:27017 pm-gov-ru
```
Где вместо `localhost:27017` нужно указать адрес MongoDb. После запуска открыть ссылку 'http://localhost:8888', учетная запись бек офиса: **demo**, пароль: **ion-demo** с правами администратора. Второй пользователь с ограниченными правами оператора **operator** пароль **ion-demo**..

Обратите внимание, что система ожидает nextcloud, доступный по адресу http://localhost:8080 и с учетной записью `demo`, пароль `ion-demo`. Параметры можно изменить в файле `deploy.ini` в папке приложения, но это потребует реинициализации приложения. 

Если у вас установлен докер - то для установки воспользуейтесь соответствующей следующей инструкцией.
```
docker run -d --name nextcloud -p 8080:80 nextcloud && \
  sleep 120 && \
  curl -X POST --connect-timeout 90 -k -s -d "install=true&adminlogin=demo&adminpass=ion-demo&adminpass-clone=ion-demo&directory=/var/www/html/data&dbtype=sqlite&dbhost=localhost" http://localhost:80
```

### Docker

Запуск приложения с использованием докер контейнера - [подробная инструкция](https://hub.docker.com/r/iondv/pm-gov-ru).

```bash
# Создайте сеть для приложений
docker network create iondv
# Запустите СУБД mongodb в этой сети 
docker run --name mongodb --net iondv -v mongodb_data:/data/db -p 27017:27017 -d mongo
# Запустите и инициализируйте nextcloud (curl посылает POST Запрос для инициализации конейнера, но можно подключиться и сконфигурировать через браузер localhost:80)
# Обязательно нужно инициализировать по тому url, по которому будет происходить обращение к nextcloud. Для этого надо или указать адрес обращения вместо `http://localhost:80` или передать в заголовке адрес хоста - `Host: nextcloud`.
# Иначе  нужно будет добавить nextcloud в доверенные домены в файле config/config.php
docker run -d --name nextcloud --net iondv -p 8080:80 nextcloud && \
  sleep 120 && \
  docker exec -it nextcloud curl -X POST --connect-timeout 90 -k -s -d "install=true&adminlogin=demo&adminpass=ion-demo&adminpass-clone=ion-demo&directory=/var/www/html/data&dbtype=sqlite&dbhost=localhost" -H "Host: nextcloud" http://localhost:80
# Запустите IONDV. PM-GOV
docker run -d -p 80:8888 --net iondv iondv/pm-gov-ru
```

Откройте ссылку `http://localhost` в браузере. Для бек офиса логин: **demo**, пароль: **ion-demo** с правами администратора. Второй пользователь с ограниченными правами оператора **operator** пароль **ion-demo**. 


## Ссылки

Для дополнительной информации смотрите следующие ресурсы:

* [Руководство пользователя](manuals/RP_pm.docx)
* [Руководство администратора](manuals/RA_pm.docx)
* [iondv.com](https://iondv.com/)  
* [Facebook](https://www.facebook.com/iondv/)


--------------------------------------------------------------------------  


#### [Licence](/LICENSE) &ensp;  [Contact us](https://iondv.com/contacts) &ensp; [Stack Overflow](https://stackoverflow.com/questions/tagged/iondv) &ensp; [FAQs](/faqs.md)          
<div><img src="https://mc.iondv.com/watch/github/docs/app/pm-gov-ru" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>


--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved.  
