const AccessControl = require('accesscontrol');
const ac = new AccessControl();


ac.grant('viewer')
    .readAny('main')
    .readAny('sub')
    .readAny('article')

//admin
ac.grant('editor')
    .extend('viewer')
    .createAny('main')                  //main cateogry permission
    .deleteAny('main')
    .updateAny('main')
    .createAny('sub')                   //subcateogry permission
    .deleteAny('sub')
    .updateAny('sub')
    .createAny('article')               //article permission
    .deleteAny('article')
    .updateAny('article')

//super
ac.grant('super')
    .extend('editor')

module.exports = ac;