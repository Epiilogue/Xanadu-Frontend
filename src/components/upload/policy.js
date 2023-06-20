import request from '@/utils/request'
export function policy() {
  return  new Promise((resolve,reject)=>{
    return request({
      url: ("oss/policy"),
      method: "get",
      baseURL: 'http://localhost:8004/dbc'
    }).then(({ data }) => {
      resolve(data);
    })
  });
}


