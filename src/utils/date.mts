function toDou (num: number | string, digit: 2 | 3 = 2): string {
  return `00${num}`.slice(0 - digit);
};

export default function createDateName () {
  const date = new Date();
  const year = date.getFullYear();
  const month = toDou(date.getMonth() + 1);
  const day = toDou(date.getDate());
  const hour = toDou(date.getHours());
  const minute = toDou(date.getMinutes());
  const second = toDou(date.getSeconds());
  const milliSecond = toDou(date.getMilliseconds(), 3);
  return `${year}${month}${day}${hour}${minute}${second}${milliSecond}`;
}