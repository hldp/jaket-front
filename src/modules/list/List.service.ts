
export class ListService {

    /**
     * Ascending order comparator between a and b
     * @param a 
     * @param b 
     * @param orderBy 
     * @returns 
     */
    public ascendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) return 1;
        if (b[orderBy] > a[orderBy]) return -1;
        return 0;
    }

    /**
     * Descending order comparator between a and b
     * @param a 
     * @param b 
     * @param orderBy 
     * @returns 
     */
    public descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    }
}