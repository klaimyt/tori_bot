export interface dbSchema {
  url: string;
  filter: filterSchema;
  id: number
}

export interface filterSchema {
  lowestPrice?: number;
  highestPrice?: number;
  filteredWords?: Array<string>;
}

export interface IDataBase {
  getAll: () => Array<dbSchema>;
  getById: (id: number) => dbSchema;
  add: (data: dbSchema) => boolean;
  remove: (id: number) => dbSchema;
  update: (newData: dbSchema, id: number) => dbSchema;
}

