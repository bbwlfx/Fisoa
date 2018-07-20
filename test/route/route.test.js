/**
 * @author:       liufeixiang
 * @date:         2017-12-19
 * @description:  路由探活 
 */

const PARALLEL = 15;
const DEFAULT_TIMEOUT_INTERVAL = PARALLEL * 15000;

const request = require('request');
const paths = require('./paths');

const domain = 'http://localhost:8087';

const timeout = 15000;
const COOKIE = {
  'Cookie': 'SESSIONID=Ae15OdnM99s0pZyDy'
};

const routes = paths.map(el => {
  el.header = Object.assign({}, el.header, COOKIE);
  return el;
})

expect.extend({
  statusToBe(res, argument) {
    const path = res.statusCode === argument;
    if(pass) {
      return {
        message: () => `${res.request.method} ${res.request.href} received expected status ${argument}`,
        pass: true
      }
    }
    return {
      message: () => `${res.request.method} ${res.request.href} received status ${res.statusCode}, expected status ${argument}`,
      pass: false
    }
  }
});

const some = (arr, iteratee) => Promise.all(arr.map(el => iteratee(el)));
const routeTest = (route, isRetry) => {
  const params = Object.assign({}, route, {
    url: domain + route.url,
    headers: route.headers,
    timeout
  });
  return request(params, (err, res, body) => {
    if(err) {
      if(!isRetry && err && err.code === 'ESOCKETTIMEDOUT') {
        return routeTest(route, true);
      }
      return Promise.reject(err);
    }
    expect(res).statusToBe(route.expectStatus || 200);    
  });
}

describe('pure path with cookie', () => {
  for(let i = 0; i < routes.length; i++) {
    test(`${i} - ${i + PARALLEL} route test`, () => some(routes.slice(i, i + PARALLEL), routeTest));
  }
});
