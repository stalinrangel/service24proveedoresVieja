import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import esLocale from 'date-fns/locale/es/index.js';
import * as moment from 'moment';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string, ...args) {
  	if (value.toString().indexOf(' ') >= 0) {
      return formatDistanceToNow(new Date(value), { includeSeconds: true, addSuffix: true, locale: esLocale });
  	} else {
  		return formatDistanceToNow(new Date(value), { addSuffix: true, locale: esLocale });
  	}  	
  }
}
