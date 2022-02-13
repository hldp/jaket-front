import { render, screen } from '@testing-library/react';
import List from './List';
import { ListService } from './List.service';

describe('list component', () => {

    test('renders list', () => {
        render(<List/>);
        const listContainer = screen.getByTestId('list-container');
        expect(listContainer).toBeInTheDocument();
    });

});

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