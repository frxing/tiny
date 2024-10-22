import path from 'path'
import tinify from 'tinify'
import ora from 'ora'
import {
  getConfig,
  updateKey
} from './index.mts'
import log from './log.mts'

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
  if (!config || config.apiKeys.length === 0 ) {
    return log.warn('请先执行命令 ty addKey ** 添加apiKey,')
  }
  const {apiKeys, currKeyIndex} = config;
  if (+currKeyIndex > apiKeys.length) {
    updateKey()
    return startCompress({input, output, completed, error})
  }
  const currentKey = apiKeys[+currKeyIndex];
  if (currentKey) {
    tinify.key = apiKeys[+currKeyIndex];
  }

  const fileName = path.basename(input);
  const spinner = ora(`开始压缩${fileName}`).start();
  tinify.fromFile(input).toFile(`${output}/${fileName}`, function(err) {
    if (err) {
      if (err instanceof tinify.AccountError) {
        updateKey()
        spinner.stop();
        startCompress({input, output, completed, error})
      } else {
        error && error(err);
        spinner.fail(`压缩失败${fileName}`);
        log.error(err);
        completed && completed({type: 'error'});
      }
    } else {
      spinner.succeed(`压缩完成${fileName}`);
      completed && completed({type: 'success'});
    }
  });

}

export default startCompress