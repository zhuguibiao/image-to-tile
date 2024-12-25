# image-to-tile
Ultra-large resolution images, online tile output
English | [简体中文](./README.zh-CN.md)

## demo
  [demo](https://zhuguibiao.github.io/image-to-tile/)

## why
- Ultra-large resolution image client display
- Game map display
- Performance pressure of drawing and marking large images


## use
- Browser：
  - Visit online[demo](https://zhuguibiao.github.io/image-to-tile/)，Upload pictures, generate tiles, and download zip with one click
  - Large images can be generated for testing using node server/image.js
  - Note：This method is primarily drawn using canvas. If the image's width and height exceed the browser's drawing limits, the generation may fail. You can use the following methods to generate it
- node
```shell
npm install 
node server/index.js 	 // don't close
Visit Browser or GET request http://localhost:8080/original_image?file_name=2222.jpg
The file path files/output/ will generate a tile map with the corresponding file name.
```
