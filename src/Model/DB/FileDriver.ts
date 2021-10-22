import { IDataBase, dbSchema } from "./DataInterface";
import * as fs from "fs";

class FileDriver implements IDataBase {
  private _path: string

  constructor(dbPath: string = './Storage/database.json') {
    this._path = dbPath
    this.checkPath(dbPath)
  }

  private checkPath(path: string) {
    if (!fs.existsSync(path)) {
      const fileName = path.split('/').pop()
      const foldersPath = path.replace(fileName, '')
      if (!fs.existsSync(foldersPath)) {
        fs.mkdirSync(foldersPath, {recursive: true})
      }
      fs.writeFileSync(fileName, '')
    } 
  }

  getAll() {
    const products = JSON.parse(fs.readFileSync(this._path).toString()) as dbSchema[]
    return products.length > 0 ? products : null 
  }

  getById(id: number) {
    const products = this.getAll()
    return products.find(product => product.id === id) ?? null
  }

  add(data: dbSchema) {
    const products = this.getAll()
    products.push(data)
    return this.save(products)
  }

  remove(id: number) {
    const products = this.getAll()
    const productIndex = products.findIndex(product => product.id === id)
    if (!productIndex) return null
    const [removedProduct] = products.slice(productIndex, 1)
    this.save(products)
    if (!this.save(products)) return null
    return removedProduct
  }

  update(newProduct: dbSchema, id: number) {
    const products = this.getAll()
    const productIndex = products.findIndex(product => product.id === id)
    if (!productIndex) return null
    const unapdatedProduct = products[productIndex] // Capture old data before update
    products[productIndex] = newProduct
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
}
