import path from 'path'
import tinify from 'tinify'
import ora from 'ora'
import {
  getConfig,
  updateKey
} from './yaml.mts'
import log from './log.mts'
import { generateHash, getLast8Chars } from './hash.mts'
import createDateName from './date.mts'

const startCompress = ({
  input,
  output,
  completed,
  error }: {
  input: string;
  output: string;
  completed?: (options: {type: 'success' | 'error'}) => void;
  error?: (err: any) => void;
}) => {
  const config = getConfig();
  if (config.api_keys.length === 0 ) {
    return log.warn('请先执行命令 ty addKey ** 添加apiKey,')
  }
  const {api_keys, key_index, file_name: outputNameType} = config;
  if (+key_index > api_keys.length) {
    updateKey()
    return startCompress({input, output, completed, error})
  }
  const currentKey = api_keys[+key_index];
  if (currentKey) {
    tinify.key = api_keys[+key_index];
  }

  const extname = path.extname(input)

  const fileName = path.basename(input, extname);
  const spinner = ora(`开始压缩${fileName}${extname}`).start();
  const isOutputHash = outputNameType === 'hash'
  const isOutputTime = outputNameType === 'time'

  let lastFileName = isOutputHash ? getLast8Chars(generateHash(fileName)) : isOutputTime ? createDateName() : fileName

  tinify.fromFile(input).toFile(`${output}/${lastFileName}${extname}`, function(err) {
    if (err) {
      if (err instanceof tinify.AccountError) {
        updateKey()
        spinner.stop();
        startCompress({input, output, completed, error})
      } else {
        error && error(err);
        spinner.fail(`压缩失败${fileName}${extname}`);
        log.error(err);
        completed && completed({type: 'error'});
      }
    } else {
      spinner.succeed(`压缩完成${fileName}${extname} ------> ${lastFileName}${extname}`);
      completed && completed({type: 'success'});
    }
  });

}

export default startCompress