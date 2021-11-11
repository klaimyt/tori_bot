import { IDataBase, dbSchema, filterSchema } from "./DataInterface";
import * as fs from "fs";

class FileDriver implements IDataBase {
  private _path: string
  private static _instance: FileDriver
  private static _lastId: number

  constructor(dbPath: string = './src/Model/DB/Storage/database.json') {
    if (FileDriver._instance) {
      return FileDriver._instance
    }
    FileDriver._instance = this
    this._path = dbPath
    this.checkPath(dbPath)
    const lastDbObject = this.getAll().pop()
    FileDriver._lastId = lastDbObject ? lastDbObject.id : 0
    return this
  }

  private checkPath(path: string) {
    const fileName = path.split('/').pop()
    const foldersPath = path.replace(fileName, '')
    if (!fs.existsSync(foldersPath)) {
      fs.mkdirSync(foldersPath, {recursive: true})
    } 
    if (!fs.existsSync(path)) {
      try {
        fs.writeFileSync(path, '[]')
      } catch (err) {
        console.error('DB PATH ERROR', err)
      }
    }
    
  }

  getAll() {
    const products = JSON.parse(fs.readFileSync(this._path).toString()) as dbSchema[]
    return products
  }

  getById(id: number) {
    const products = this.getAll()
    return products.find(product => product.id === id) ?? null
  }

  add(url: string, filter: filterSchema) {
    const products = this.getAll()
    products.push({url: url, filter: filter, id: this.setId()})
    return this.save(products)
  }

  remove(id: number) {
    const products = this.getAll()
    const productIndex = products.findIndex(product => product.id === id)
    if (productIndex < 0) return null
    const [removedProduct] = products.splice(productIndex, 1)
    this.save(products)
    if (!this.save(products)) return null
    return removedProduct
  }

  removeAll() {
    const oldData = this.getAll()
    fs.writeFileSync(this._path, '[]')
    return oldData
  }

  update(newProduct: {url: string, filter?: filterSchema}, id: number) {
    const products = this.getAll()
    const productIndex = products.findIndex(product => product.id === id)
    if (productIndex < 0) return null
    const unapdatedProduct = products[productIndex] // Capture old data before update
    products[productIndex] = {...unapdatedProduct, ...newProduct}
    if (!this.save(products)) return null
    return unapdatedProduct
  }

  private save(products: dbSchema[]) {
    try {
      fs.writeFileSync(this._path, JSON.stringify(products))
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  private setId() {
    // If undefined set 1 else add 1
    FileDriver._lastId = FileDriver._lastId ? FileDriver._lastId += 1 : 1
    return FileDriver._lastId
  }

  getLastId() {
    return FileDriver._lastId
  }
}

export default FileDriver
