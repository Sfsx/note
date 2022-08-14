# uuid 生成
```ts
// prep-work
const _hex: string[] = [];
for (let i = 0; i < 256; i++) {
	_hex.push(i.toString(16).padStart(2, '0'));
}

cosnt fillRandomValue = (bucket) => {
  for(i = 0; i < bucket.length; i++) {
    bucket[i] = Math.floor(Math.random() * 256);
  }
  return bucket;
}

// uuid v4
const generateUuid = () => {
  // get data
  const _data = Uint8Array(8);
  const data = fillRandomValue(_data);

  // set version bits
	_data[6] = (_data[6] & 0x0f) | 0x40;
	_data[8] = (_data[8] & 0x3f) | 0x80;

  // print as string
	let i = 0;
	let result = '';
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += '-';
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += '-';
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += '-';
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += '-';
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	result += _hex[data[i++]];
	return result;
}

const _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(value: string): boolean {
	return _UUIDPattern.test(value);
}
```

