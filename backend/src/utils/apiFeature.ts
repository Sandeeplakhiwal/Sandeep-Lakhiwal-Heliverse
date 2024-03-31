import { Document, FilterQuery, Model, Query } from "mongoose";

interface QueryString {
  keyword?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

export class ApiFeatures<T extends Document> {
  query: Query<T[], T>;
  queryStr: QueryString;

  constructor(query: Query<T[], T>, queryStr: QueryString) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(): this {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { first_name: { $regex: this.queryStr.keyword, $options: "i" } },
            { last_name: { $regex: this.queryStr.keyword, $options: "i" } },
            { email: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword } as FilterQuery<T>);
    return this;
  }

  filter(): this {
    const queryCopy = { ...this.queryStr };

    // Removing some fields for filtering
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Convert query operators
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage: number): this {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
