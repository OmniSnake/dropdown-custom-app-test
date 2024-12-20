import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Category } from '../modeles/category.model';

interface MyDB extends DBSchema {
  selections: {
    key: string;
    value: Category[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('DropdownDB', 1, {
      upgrade(db: IDBPDatabase<MyDB>) {
        db.createObjectStore('selections');
      },
    });
  }

  public async getSelections(): Promise<Category[] | undefined> {
    const db = await this.dbPromise;
    return db.get('selections', 'selectedCategories');
  }

  public async saveSelections(categories: Category[]): Promise<void> {
    const db = await this.dbPromise;
    await db.put('selections', categories, 'selectedCategories');
  }
}