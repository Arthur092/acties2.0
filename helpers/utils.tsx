export function getActivityWithId(activity: any) {
    return {
        id: activity.id,
        ...Object.assign({}, activity.data())
    }
}

export function formatDecimal(number: number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    return arr[1] ? arr.join('.'): arr[0];
  }