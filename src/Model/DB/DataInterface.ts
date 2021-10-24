export interface dbSchema {
  url: string;
  filter?: filterSchema;
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
  add: (url: string, filter?: filterSchema) => boolean;
  remove: (id: number) => dbSchema;
  update: (newData: {url: string, filter?: filterSchema}, id: number) => dbSchema;
}

