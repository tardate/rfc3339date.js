/*
 * rfc3339date.js
 *
 * Adds ISO 8601 / RFC 3339 date parsing to the Javascript Date object.
 * Usage: 
 *   var d = Date.parseISO8601( "2010-07-20T15:00:00Z" );
 *   var d = Date.parse( "2010-07-20T15:00:00Z" );
 * Tested for compatibilty/coexistence with:
 *   - jQuery [http://jquery.com]
 *   - datejs [http://www.datejs.com/]
 *
 * Copyright (c) 2010 Paul GALLAGHER http://tardate.com
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 */

Number.prototype.toPaddedString = function(len , fillchar) {
  var result = this.toString();
  if(typeof(fillchar) == 'undefined'){ fillchar = '0' };
  while(result.length < len){ result = fillchar + result; };
  return result;
}


Date.prototype.formatISO8601 = function(){
  var result = this.getUTCFullYear().toString();
  result += '-' + (this.getUTCMonth() + 1).toPaddedString(2);
  result += '-' + this.getUTCDate().toPaddedString(2);
  result += 'T' + this.getUTCHours().toPaddedString(2);
  result += ':' + this.getUTCMinutes().toPaddedString(2);
  result += ':' + this.getUTCSeconds().toPaddedString(2);
  if(this.getUTCMilliseconds()>0) result += '.' + this.getUTCMilliseconds().toPaddedString(3);
  return result + 'Z';
}


Date.prototype.formatLocalISO8601 = function(){
}

 /* 
 * Date.parseISO8601
 * extend Date with a method parsing ISO8601 / RFC 3339 date strings.
 * Usage: var d = Date.parseISO8601( "2010-07-20T15:00:00Z" ); 
 */
Date.parseISO8601 = function(dString){
  if (typeof dString != 'string') return;
  var result;
  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)?(:)?(\d\d)?([\.,]\d+)?($|Z|([+-])(\d\d)(:)?(\d\d)?)/i;
  var d = dString.match(new RegExp(regexp));
  if (d) {
    var year = parseInt(d[1],10);
    var mon = parseInt(d[3],10) - 1;
    var day = parseInt(d[5],10);
    var hour = parseInt(d[7],10);
    var mins = ( d[9] ? parseInt(d[9],10) : 0 );
    var secs = ( d[11] ? parseInt(d[11],10) : 0 );
    var millis = ( d[12] ? parseFloat(String(1.5).charAt(1) + d[12].slice(1)) * 1000 : 0 );
    if (d[13]) {
      result = new Date();
      result.setUTCFullYear(year);
      result.setUTCMonth(mon);
      result.setUTCDate(day);
      result.setUTCHours(hour);
      result.setUTCMinutes(mins);
      result.setUTCSeconds(secs);
      result.setUTCMilliseconds(millis);
      if (d[13] && d[14]) {
        var offset = (d[15] * 60) 
        if (d[17]) offset += parseInt(d[17],10);
        offset *= ((d[14] == '-') ? -1 : 1);
        result.setTime(result.getTime() - offset * 60 * 1000);
      }
    } else {
      result = new Date(year,mon,day,hour,mins,secs,millis);
    }
  }
  return result;
};

/* 
 * Date.parse
 * extend Date with a parse method alias for parseISO8601.
 * If parse is already defined, chain methods to include parseISO8601
 * Usage: var d = Date.parse( "2010-07-20T15:00:00Z" ); 
 */
if (typeof Date.parse != 'function') {
  Date.parse = Date.parseISO8601;
} else {
  var oldparse = Date.parse;
  Date.parse = function(d) {
    var result = Date.parseISO8601(d);
    if (!result && oldparse) {
      result = oldparse(d);
    }
    return result;
  }
}
