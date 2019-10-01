# command

## nvm

1. win
  
    例如，我们要安装4.2.2版本，可以用如下命令：

    ```shell
    nvm install 4.2.2
    ```

    删除node

    ```shell
    nvm uninstall 6.9.2
    ```

    查看远程服务器上所有的可用版本

    ```shell
    nvm ls available
    ```

2. unix

## npm

1. win

    查看全局包

    ```shell
    npm list -g --depth 0
    ```

    查看npm源

    ```shell
    npm config get registry
    ```

2. unix

## nginx

1. win

    启动

    ```shell
    start nginx
    ```

    关闭

    ```shell
    nginx -s stop
    ```

    重启

    ```shell
    nginx -s reload
    ```

2. unix

## win 查看文件 hash

```shell
certutil -hashfile yourfilename MD5

certutil -hashfile yourfilename SHA1

certutil -hashfile yourfilename SHA256
```
