export class Slot {
    private _centerId: number;
    private _centerName: string;
    private _date: string;

    constructor(centerId:number,centerName:string,date:string){
        this._centerId=centerId
        this._centerName=centerName;
        this._date=date
    }

    public getCenterName(): string {
        return this._centerName;
    }

    public getDate(): string {
        return this._date
    }

    public getCenterId(): number {
        return this._centerId
    }
}