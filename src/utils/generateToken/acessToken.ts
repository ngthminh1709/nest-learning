import { sign } from 'jsonwebtoken';

class AcessToken {
    constructor() {}

    id: any;
    role: string;

    sign() {
        return sign({ ...this }, process.env.ACESS_TOKEN_SECRET);
    }
}

export default AcessToken;