tiny 命令行压缩



1.  安装
   
   ```bash
   npm install -g @frxing/tiny
   ```

2. 添加apiKey
   
   ```bash
   tiny addKey ***
   ```

3. 命令
   
   ```javascript
   // 全局命令 ti/ty/tiny
   
   ty  // 默认压缩当前执行的目录
   ty '**/**' // 压缩指定目录
   ty '**/**.png' // 压缩指定文件
   ```

4. 输出
   
  在文件的同级目录下会生成一个dest目录，这里面是压缩后的文件
