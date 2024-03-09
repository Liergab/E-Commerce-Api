import bcrypt from 'bcrypt'

export const hashpassword = async({ password }:{ password: string }): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashpassword = bcrypt.hash(password,salt);
        return hashpassword
    } catch (error) {
        throw new Error('Error generating hashed password');
    }
}

export const passwordCompared = async({plain, hashPassword}:{plain:string, hashPassword:string}) => {
   return await bcrypt.compare(plain,hashPassword);
}