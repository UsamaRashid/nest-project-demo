import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description,
      price,
    });

    // this.products.push(newProduct);
    const result = await newProduct.save();
    console.log('resulrtt:', result);
    // return newProduct;
    return result.id as string;
  }

  async getProducts() {
    const result = await this.productModel.find().exec();
    // return result as Product[];
    return result.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));

    // return [...this.products];
  }

  async getSingleProduct(prodId: string) {
    const product = await this.findProduct(prodId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    prodId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updateProduct = await this.findProduct(prodId);

    if (title) {
      updateProduct.title = title;
    }
    if (desc) {
      updateProduct.description = desc;
    }
    if (price) {
      updateProduct.price = price;
    }
    updateProduct.save();
    // return { ...product };
  }

  async deleteProduct(prodId: string) {
    // const [_, prodIndex] = this.findProduct(prodId);
    // // remove 1 index
    // this.products.splice(prodIndex, 1);
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find Product');
    }
  }

  private async findProduct(prodId: string): Promise<Product> {
    // [Product, number]
    // const productIndex = this.products.findIndex((prod) => prod.id === prodId);
    // const product = this.products[productIndex];
    // if (!product) {
    //   throw new NotFoundException('Could not find Product');
    // }
    // return [product, productIndex];
    let product;
    try {
      product = await this.productModel.findById(prodId).exec();
    } catch (e) {}
    if (!product) {
      throw new NotFoundException('Could not find Product');
    }
    return product;
    // return {
    //   id: product.id,
    //   title: product.title,
    //   description: product.description,
    //   price: product.price,
    // };
  }
}
