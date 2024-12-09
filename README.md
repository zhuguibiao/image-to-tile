# image-to-tile
超大分辨率图片，在线输出瓦片图

## demo
  [demo](https://zhuguibiao.github.io/image-to-tile/)

## why
- 超大分辨率图片在客户端展示
- 游戏地图 map模式
- 大图绘制，标记等操作性能压力


## use
- 浏览器：
  - 直接访问[demo](https://zhuguibiao.github.io/image-to-tile/)，即可上传图片，生成瓦片图，一键下载zip
  - 注：该方法主要是由canvas 绘制，如果图片宽高超过浏览器绘制限制，可能生成失败，可以采取下面方式生成
- 
- node
```shell
npm install 
node server/index.js 	 // 不要关
浏览器访问或者GET请求 http://localhost:8080/original_image?file_name=2222.jpg
文件路径files/output/下面就会生成对应文件命名的瓦片图
```
