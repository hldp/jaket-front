import { ListService } from './List.service';

describe('list service', () => {
    let listService = new ListService();

    test('ascendingComparator', () => {
        let result = listService.ascendingComparator({ test: 2 }, { test: 1 }, 'test');
        expect(result).toBe(1);
        result = listService.ascendingComparator({ test: 1 }, { test: 2 }, 'test');
        expect(result).toBe(-1);
        result = listService.ascendingComparator({ test: 2 }, { test: 2 }, 'test');
        expect(result).toBe(0);
    });

    test('descendingComparator', () => {
        let result = listService.descendingComparator({ test: 2 }, { test: 1 }, 'test');
        expect(result).toBe(-1);
        result = listService.descendingComparator({ test: 1 }, { test: 2 }, 'test');
        expect(result).toBe(1);
        result = listService.descendingComparator({ test: 2 }, { test: 2 }, 'test');
        expect(result).toBe(0);
    });

});