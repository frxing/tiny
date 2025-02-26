#!/usr/bin/env node
// @ts-nocheck
import { existsSync, statSync } from 'fs'
import { resolve } from 'path'
import { program } from 'commander'
import compressDir from '@/utils/directory.mjs'
import compressFile from '@/utils/file.mjs'
import chalk from 'chalk'
import {
  userHomeDir,
  isImage
} from './utils/index.mts'
import log from './utils/log.mts'
import {
  getConfig,
  addKey,
  removeKey
} from './utils/yaml.mts'

program
  .command('addKey')
  .description('添加apiKey')
  .action((module, options) => {
    const args = options.args[0]
    if (args) {
      args.split(',').forEach((arg: string) => {
        addKey(arg)
      });
    }
  })

program
  .command('removeKey')
  .description('删除apiKey')
  .action((module, options) => {
    const args = options.args[0]
    if (args) {
      args.split(',').forEach((arg: string) => {
        removeKey(arg)
      });
    }
  })

program
  .command('config')
  .description('查看配置')
  .action((module, options) => {
    console.log(getConfig());
  })

program
  .description('开始压缩')
  .option('-v, --version', '版本')
  .action((module, options) => {
    const opts = options.opts()

    if (opts.version) {
      log(require('../package.json').version);
      return false
    }

    const oPath = options.args[0]

    if (oPath) {
      const fullPath = resolve(process.cwd(), oPath)

      if (!existsSync(fullPath)) return log.warn('文件或目录不存在')

      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        compressDir(fullPath)
        return false
      }

      if (stat.isFile()) {
        if (isImage(fullPath)) {
          compressFile(fullPath)
        } else {
          log.warn('图片格式不正确');
        }
      }
    } else {
      compressDir()
    }
  })

program.parse(process.argv)