
export class ProductDto {
    id: number;
    name: string;
    price: number;
    createdAt: string | null;

  constructor( id: number, name: string, price: number,createdAt: string|null ) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.createdAt = createdAt;
  }
  static generateDefault():ProductDto{
    return new ProductDto(
       0,
       "test lesson 12",
      100,
      new Date().toISOString(),
    )
  }
  static generateCustom(name:string,price:number): ProductDto {
    return new ProductDto(
      0,
      name,
        price,
        new Date().toISOString(),
    )
  }

}