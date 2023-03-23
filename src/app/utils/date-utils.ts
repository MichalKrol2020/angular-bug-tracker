const monthNames =
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

export class DateUtils
{

  static getRelativeTimeSince(date: Date): string
  {
    const sendDate = new Date(date);
    const now = new Date();

    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    if (sendDate < weekAgo) {
      return ' more than a week ago';
    }

    const dayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 23, now.getMinutes() - 59);
    if (sendDate < dayAgo) {
      const daysAgo = Math.floor((now.getTime() - sendDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
    }

    const hourAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1);
    if (sendDate < hourAgo) {
      const hoursAgo = Math.floor((now.getTime() - sendDate.getTime()) / (1000 * 60 * 60));
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    }

    const minutesAgo = Math.floor((now.getTime() - sendDate.getTime()) / (1000 * 60));
    if (minutesAgo === 0) {
      return 'just now';
    }

    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  }


  static getDayMonthYear(date: Date)
  {
    const dateZ = this.getUTCDate(date);
    const dayPrefix = (dateZ.getDate() < 10) ? '0' : '';
    const month = this.getMonthName(dateZ);
    const year = dateZ.getFullYear();

    return `${dayPrefix}${dateZ.getDate()} ${month} ${year}`;
  }

  static getUTCDate(date: Date)
  {
    const dateZulu = new Date(date).toISOString().substring(0, 21) + 'Z';
    return new Date(dateZulu);
  }

  static getMonthName(date: Date)
  {
    return monthNames[date.getMonth()];
  }
}
