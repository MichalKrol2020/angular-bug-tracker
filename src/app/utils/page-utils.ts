
export class PageUtils
{
   /**
    * @param divider - a constant to divide the inner height by it.
    * <dl>
    * @param minSize - minimum items count. Counted size cannot be less than that.
    *
    *  The <strong>PageUtils.calculatePageSize()</strong>
    *  counts a collection size to fit the window height.
    *  Always returns a valid counted size, which can be used
    *  to display specific amount of items in table
    *  to fit the window.
    *
    * @returns counted size of a collection
   */
   static calculatePageSize(divider: number, minSize: number): number
   {
     let countedSize = Math.floor(window.innerHeight / divider);

     if(countedSize < minSize)
     {
       return minSize;
     }

     return countedSize;
   }


  /**
   * @param currentPageHeight - previously measured height of window.
   * @param newPageHeight - newly measured hight of window.
   * @param divider - a constant to divide the inner height by it.
   * @param minSize - minimum items count. Counted size cannot be less than that.
   * @param currentSize - current collection size.
   *
   * The <strong>PageUtils.calculatePageSizeWithPrevention()</strong> counts
   * a collection size to fit the window height.
   *
   * It also checks if the height difference between the currentPageHeight
   * and the newPageHeight is less than 80, to prevent from too many HttpRequests.
   *
   * @returns counted size of the collection
   * @returns -1 if the difference between currentPageHeight and newPageHeight is less than 80,
   *          or the countedSize is less than minSize.
   */
   static calculatePageSizeWithPrevention(currentPageHeight: number, newPageHeight: number, divider: number, minSize: number, currentSize: number): number
   {
     let heightDifference = Math.abs(currentPageHeight - newPageHeight);
     if(heightDifference < 80)
     {
       return -1;
     }

     const countedSize = this.calculatePageSize(divider, minSize);
     if(countedSize == minSize)
     {
       if(currentSize == minSize)
       {
         return -1;
       }
     }

     return countedSize;
   }

}
