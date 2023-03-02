/*
 * @Date: 2023-03-01 16:55:13
 * @LastEditors: aei(imaei@foxmail.com)
 * @LastEditTime: 2023-03-01 16:55:20
 * @FilePath: \wtw-front\wtw-story\entry.js
 * @description: 
 */
const render = ($) => {
    $('#purehtml-container').html('Hello, render with jQuery');
    return Promise.resolve();
  };
  
  ((global) => {
    global['purehtml'] = {
      bootstrap: () => {
        console.log('purehtml bootstrap');
        return Promise.resolve();
      },
      mount: () => {
        console.log('purehtml mount');
        return render($);
      },
      unmount: () => {
        console.log('purehtml unmount');
        return Promise.resolve();
      },
    };
  })(window);