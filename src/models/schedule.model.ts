export class Schedule {
    public id: number;
    public day: string;
    public open: boolean;
    public opening: Date;
    public closing: Date;

    constructor(id: number, day: string, open: boolean, opening: Date, closing: Date) {
        this.id = id;
        this.day = day;
        this.open = open;
        this.opening = opening;
        this.closing = closing;
    }
}