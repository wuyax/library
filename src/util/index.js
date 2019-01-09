

/**
 * JFE脚本库，JFE.util下挂载了项目中常见的工具函数
 * @namespace util
 */

//type
/* 
export {isArray} from './type/is-array.js'
export {isDate} from './type/is-date.js'
export {isFunction} from './type/is-function.js'
export {isNumber} from './type/is-number.js'
export {isObjectEmpty} from './type/is-object-empty.js'
export {isObject} from './type/is-object.js'
export {isCharacter} from './type/is-character.js'
export {isInteger} from './type/is-Integer.js'

//check
export {checkNotNull} from './validate/checkNotNull.js'
export {checkString} from './validate/checkString.js'
export {checkPhone} from './validate/checkPhone.js'
export {checkEmail} from './validate/checkEmail.js'


//array
export {arrayMaxOrMin} from './array/getArrayMaxOrMin.js'
export {arrayUnique} from './array/unique.js'
export {arrayConcat} from './array/arrayConcat.js'
export {arrShuffle} from './array/arrShuffle.js'


//stroage
export {cookieGet} from './storage/cookieGet.js'
export {cookieSet} from './storage/cookieSet.js'
export {cookieDel} from './storage/cookieDel.js'

//common
// export {extend} from './module/extend.js'

export {classOf} from './common/classOf.js'
export {compare} from './common/compare.js'
export {extend} from './common/extend.js'
export {formatTime} from './common/formatTime.js'
export {isBrowser} from './common/isBrowser.js'
export {Random} from './common/Random.js'
export {urlArgs} from './common/urlArgs.js'
export {urlTrans} from './common/urlTrans.js'
export {strContains} from './common/strContains.js'
export {maxObj} from './common/maxObj.js'
export {excerpt} from './common/excerpt.js'
export {exitFullScreen } from './common/fullScreen.js'
export {fullScreen} from './common/fullScreen.js'
export {openWindow} from './common/openWindow.js' */

const arrShuffle = require('./array/arrShuffle')
const arrayConcat = require('./array/arrayConcat')
const getArrayMaxOrMin = require('./array/getArrayMaxOrMin')
const unique = require('./array/unique')
module.exports = {
  arrShuffle,
  arrayConcat,
  getArrayMaxOrMin,
  unique
}