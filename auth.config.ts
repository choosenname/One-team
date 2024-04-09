import Credentials from "@auth/core/providers/credentials";
import {LoginSchema} from "@/schemas";
import {getUserByName} from "@/data/user";
import bcrypt from "bcryptjs";
import {NextAuthConfig} from "next-auth";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const {name, password} = validatedFields.data;

                    const user = await getUserByName(name);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ],
} satisfies NextAuthConfig