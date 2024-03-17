export type createAddressRequestBody = {
    lineOne    : string;
    lineTwo    : string,
    city       : string,
    country    : string,
    pincode    : string
}

export type updateUserRequestBody = {
    name                   : string,
    defaultBillingAddress  : number | null, 
    defaultShippingAddress : number | null
}