import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortVip'
})
export class SortVipPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (!Array.isArray(value)) {
            return;
        }
        value.sort((a: any, b: any) => {
            if (a.sub.vip === b.sub.vip) {
                return 0;
            }
            if (a.sub.vip) {
                return -1;
            }
            if (b.sub.vip) {
                return 1;
            }
        });
        return value;
    }

}
