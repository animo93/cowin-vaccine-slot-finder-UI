export class Slot {
    private _centerId: number;
    private _centerName: string;
    private _date: string;
    private _minAgeLimit: string;
    private _vaccine: string;

    constructor(centerId:number,centerName:string,date:string,minAgeLimit:string,vaccine:string){
        this._centerId=centerId
        this._centerName=centerName;
        this._date=date;
        this._minAgeLimit=minAgeLimit;
        this._vaccine=vaccine;
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

    public getMinAgeLimit(): string {
        return this._minAgeLimit
    }

    public getVaccine(): string {
        return this._vaccine
    }
}