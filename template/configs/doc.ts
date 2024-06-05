import { define, request } from '@api';

export const getName = define<{ id: number }, { name: string }>({
  url: 'getName',
  method: 'get',
});

export const setName = define({
  url: 'setName',
  method: 'post',
});

// getName({ id: 22 }).then((data) => {
//   console.info(data.name);
// });

// request({
//   url: 'aa',
//   params: { a: 1 },
// }).then((data) => {
//   console.info({ data });
// });
