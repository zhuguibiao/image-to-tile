# image-to-tile
	超大分辨率图片，输出瓦片图并提供瓦片图web服务。
## why
	超大分辨率图片在客户端展示，性能压力，借由大多数地图类应用的瓦片图处理方式。
## demo
 [demo链接](https://zhuguibiao.github.io/image-to-tile/)
## use

```shell
npm install 
node server.js 	 // 不要关

浏览器访问或者GET请求 http://localhost:8080/original_image?file_name=2222.jpg

然后新开一个shell启动web预览
npm start
```
