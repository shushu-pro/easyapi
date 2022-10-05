import { define } from '@api';

export const getName = define<{ id: number }, { name: string }>({
  url: 'getName',
  method: 'get',
});

export const setName = define({
  url: 'setName',
  method: 'post',
});
