import {Injectable} from '@angular/core';
import {DBSchema, openDB} from 'idb'
import {Observable, Subject} from 'rxjs';
import {Slot} from '../slot.model'

interface CowinSlotDB extends DBSchema {
  'slots': {
    value : {
      centerId: number;
      centerName: string;
      dates: string[];
      minAgeLimit: string;
      vaccine: string;
    };
    key: string;
    indexes: { 'by-centerId': number };
  }; 

}


@Injectable({
  providedIn: 'root'
})
export class IdbService {
//private _dataChange: Subject<Schedule> = new Subject<Schedule>();
private _dbPromise;
private DB_VERSION:number =2;

constructor() {
}

async connectToIDB(target: string) {
  let self =this
  const dbPromise = await openDB<CowinSlotDB>(target, this.DB_VERSION, {
    upgrade(db,oldVersion,newVersion) {
      console.log("Old version ",oldVersion)
      console.log("New version",newVersion)
      if(db.objectStoreNames.contains('slots')){
        db.deleteObjectStore('slots')
      }
      var store=db.createObjectStore('slots',{
        keyPath:'centerId',
        autoIncrement: true,
      });
      store.createIndex('by-centerId','centerId')
    }
  });
    /*
    if (!UpgradeDB.objectStoreNames.contains('Items')) {
      UpgradeDB.createObjectStore('Items', {keyPath: 'id', autoIncrement: true});
    }
    if (!UpgradeDB.objectStoreNames.contains('Sync-Items')) {
      UpgradeDB.createObjectStore('Sync-Items', {keyPath: 'id', autoIncrement: true});
    }
  });*/
}

async addSlot(target: string, value: Slot) {
  //let self = this
  console.log("Inside add Item")
  const dbPromise = await openDB<CowinSlotDB>(target,this.DB_VERSION, {
    upgrade(db,oldVersion,newVersion) {
      console.log("Old version ",oldVersion)
      console.log("New version",newVersion)
      var store=db.createObjectStore('slots',{
        keyPath:'centerId',
        autoIncrement: true,
      });
      //store.createIndex('by-centerId','centerId')
    
    }
  })
  console.log("Object store exists",value.getCenterId())
  const tx = await dbPromise.transaction('slots','readwrite')
  const store = await tx.objectStore('slots');
  store.openCursor(IDBKeyRange.only(value.getCenterId())).then((cursor)=>{
    if(cursor){
      console.log("Current value ",cursor.value);
      const currentDates:string[] = cursor.value.dates;
      if(!currentDates.includes(value.getDate())){
        currentDates.push(value.getDate())
      }  
      cursor.update({centerId:value.getCenterId(),centerName:value.getCenterName(),dates:currentDates
        ,minAgeLimit:value.getMinAgeLimit(),vaccine:value.getVaccine()})
    }else {
      store.put({centerId:value.getCenterId(),centerName:value.getCenterName(),dates:[value.getDate()]
        ,minAgeLimit:value.getMinAgeLimit(),vaccine:value.getVaccine()})
        .then(console.log)
    }
    
  })
  /*
  dbPromise.getAllFromIndex('slots','by-slotId',value.getSlotId())
    .then((slotVals)=>{
      if(slotVals.length){
        console.log("Center not found");
        store.put({slotId:value.getSlotId(),centerName:value.getCenterName(),dates:value.getDates()})
          .then(console.log)
      }
      slotVals.forEach((val)=>{
        console.log("from index ",val)
      })
    })
    .catch((err)=>console.log("Error is ",err))
  store.put({slotId:value.getSlotId(),centerName:value.getCenterName(),dates:value.getDates()})
    .then(console.log)*/
  await tx.done
  
}

async deleteItems(target: string, value: Slot) {
  const dbPromise = await openDB<CowinSlotDB>(target,this.DB_VERSION, {
    upgrade(db,oldVersion,newVesion,tx) {
      const store = db.createObjectStore('slots')    
    }
  })
  const tx = await dbPromise.transaction('slots','readwrite')
  const store = await tx.objectStore('slots');
  //await store.delete(value.getSlotId());
  await tx.done
}

async deleteTable(target: string) {
  const dbPromise = await openDB<CowinSlotDB>(target,this.DB_VERSION, {
    upgrade(db,oldVersion,newVesion,tx) {
      const store = db.createObjectStore('slots')    
    }
  })
  //await dbPromise.deleteObjectStore('slots')
  const tx = await dbPromise.transaction('slots','readwrite')
  const store = await tx.objectStore('slots');
  const allKeys: string[]=await store.getAllKeys()
  allKeys.forEach(async (key) => {
    await store.delete(IDBKeyRange.only(key));
  })

  
  await tx.done
}

async getAllData(target: string) {
  const dbPromise = await openDB<CowinSlotDB>(target,this.DB_VERSION, {
    upgrade(db,oldVersion,newVesion,tx) {
      const store = db.createObjectStore('slots')    
    }
  })
  const tx = await dbPromise.transaction('slots','readonly')
  const store = await tx.objectStore('slots');
  const data = await store.getAll();
  await tx.done;
  return data;
}

async getDataByKey(target: string,key: number) {
  const dbPromise = await openDB<CowinSlotDB>(target,this.DB_VERSION, {
    upgrade(db,oldVersion,newVesion,tx) {
      const store = db.createObjectStore('slots')    
    }
  })
  const tx = await dbPromise.transaction('slots','readonly')
  const store = await tx.objectStore('slots');
  const data = await store.get(IDBKeyRange.only(key));
  console.log("data", data);
  await tx.done
  return data;
}
/*
dataChanged(): Observable<Schedule> {
    return this._dataChange;
  }*/
}