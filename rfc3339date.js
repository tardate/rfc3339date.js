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
    var offset = 0;
    result = new Date();

    if (d[13]) {
      result.setUTCFullYear(parseInt(d[1],10));
      result.setUTCMonth(parseInt(d[3],10) - 1);
      result.setUTCDate(parseInt(d[5],10));
      result.setUTCHours(parseInt(d[7],10));
      var mins = ( d[9] ? parseInt(d[9],10) : 0 );
      result.setUTCMinutes(mins);
      var secs = ( d[11] ? parseInt(d[11],10) : 0 );
      result.setUTCSeconds(secs);
      if (d[12]) {
        var decimalSeperator = String(1.5).charAt(1);
        result.setUTCMilliseconds(parseFloat(decimalSeperator + d[12].slice(1)) * 1000);
      } else
        result.setUTCMilliseconds(0);

      if (d[13] && d[14]) {
        offset = (d[15] * 60) 
        if (d[17]) offset += parseInt(d[17],10);
        offset *= ((d[14] == '-') ? -1 : 1);
        result.setTime(result.getTime() - offset * 60 * 1000);
      }
    } else {
      result.setFullYear(parseInt(d[1],10));
      result.setMonth(parseInt(d[3],10) - 1);
      result.setDate(parseInt(d[5],10));
      result.setHours(parseInt(d[7],10));
      result.setMinutes(parseInt(d[9],10));
      result.setSeconds(parseInt(d[11],10));
      if (d[12])
        result.setMilliseconds(parseFloat(d[12]) * 1000);
      else
        result.setMilliseconds(0);
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
