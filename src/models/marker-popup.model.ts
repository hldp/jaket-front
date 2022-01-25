export class MarkerPopup {
    public content: string;
    public autoPan: boolean = false;
    public minWidth: number = 0;
    public maxWidth: number = 0;
    public maxHeight: number = 0;

    constructor(content: string, autoPan: boolean, minWidth: number, maxWidth: number, maxHeight: number){
        this.content = content;
        this.autoPan = autoPan;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }
}