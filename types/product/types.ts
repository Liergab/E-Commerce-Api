
export type updateProductRequestBody = {
    name?        : string;
    description? : string;
    price?       : number;
    tags?        : string | string[];
}

export type createProductRequestBody = {
    name        :string;
    description :string;
    price       :number;
    tags        :string | string[];
}
