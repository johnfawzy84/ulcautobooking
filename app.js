const { ENOMEM } = require('constants');
const EventEmitter = require('events');
const emitterObj = new EventEmitter();

emitterObj.on('messageLogged',(arg) => {
    console.log('listener called',arg)
})
emitterObj.emit('messageLogged',{id:1, url:'http://blah.com'});