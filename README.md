# ubuntu MQTT server(dcoker)

## 安裝mqtt container

```
docker pull eclipse-mosquitto:latest        //抓取mosquitto server images檔
mkdir -p /mosquitto/config                  //建立本機端與container config對應的資料
mkdir -p /mosquitto/data                    //建立本機端與container data對應的資料
mkdir -p /mosquitto/log                     //建立本機端與container log對應的資料
/mosquitto/config/mosquitto.conf            //建立本機端與container 要使用的config檔案(會設定資料存放的路徑,log路徑,port,協定)
docker run -d --name mqtt -p 1883:1883 -v /mosquitto:/mosquitto -v /mosquitto/data:/mosquitto/data -v /mosquitto/log:/mosquitto/log eclipse-mosquitto      //建立 mqtt container 以及設定對應的port 與 資料夾
docker ps -a                         //查看有無正常啟動
```

## 安裝mqtt client

```
apt install mosquitto-clients //安裝測試工具
mosquitto_sub -h 127.0.0.1 -t MQTT/Docker                  //訂閱一個主題 IP為127.0.0.1
mosquitto_pub -h 127.0.0.1 -t MQTT/Docker -m "pub Message" //發佈的主題 IP為127.0.0.1
```

## 安裝docker-compoer

```
curl -L https://github.com/docker/compose/releases/download/1.23.0-rc3/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose      //1.23.0-rc3 為安裝版本

chmod +x /usr/local/bin/docker-compose
```

## 設定Configuration：mosquitto.conf

```
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log

allow_anonymous true

listener 1883
protocol mqtt
```

## 設定dockerfile檔案

在nestjs資料夾下建立dockerfil

```
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]
    
```

在執行 docker build -t nestjs_node .

## 設定docker-compoer.yaml檔案

```
version: "3"
services:
  mosquitto:
    image: docker pull eclipse-mosquitto:latest                   //安裝的image
    container_name: compose_mqtt                                  //容器的名稱
    volumes:                                                      //對應的資料夾
      - ./mosquitto:/mosquitto
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    ports:
      - 1883:1883                                                 //與外部的port對應 可+IP上去 ex: 127.0.0.1:1883:1883
      - 9001:9001

    redis:
    image: redis:latest
    container_name: compose_redis
    ports:
      - 6379:6379

    nestjs/cli:
    image: nestjs_node
    container_name: compose_nestjs
    ports:
      - 3000:3000
    
```

## 設定後啟動docker-compoer

```
切換到yaml檔案目錄

docker-compose up -d                          //-d為背景執行

```

