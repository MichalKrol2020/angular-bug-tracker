
export class Sort
{
  public static sortByTableHeader(objectsArray: any[], orderBy: string, ascending: boolean)
  {
    return (objectsArray || []).sort((a, b) =>
    {
      let first = a[orderBy];
      let second = b[orderBy];

      if(first == null)
      {
        return -1;
      }

      if(second == null)
      {
        return 1;
      }

      if (first > second)
      {
        return (ascending) ? 1 : -1;
      }

      if (first < second)
      {
        return (ascending) ? -1 : 1;
      }

      return 0;
    });
  }
  //
  // private static getProperty(object: any, orderBy: string[], startIndex: number = 0): any
  // {
  //   if(object == null)
  //   {
  //     return object;
  //   }
  //
  //   if(orderBy.length == startIndex + 1)
  //   {
  //     return object[orderBy[startIndex]];
  //   }
  //
  //   object = object[orderBy[startIndex]];
  //   startIndex++;
  //   return this.getProperty(object, orderBy, startIndex);
  // }
}
