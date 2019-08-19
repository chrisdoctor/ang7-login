export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthday: string;
    address: UserAddress[];
    token: string;
}

class UserAddress {
    street1: string;
    street2?: string;
    city: string;
    country: string;
    postcode: string;
}