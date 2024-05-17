"use client";

import {CardWrapper} from "@/components/auth/card-wrapper"
import {useForm} from "react-hook-form";
import {LoginSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {login} from "@/actions/login";
import {useState, useTransition} from "react";

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema), defaultValues: {
            name: "", password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");

        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data?.error);
                });
        });
    }

    return (<CardWrapper
        headerLabel="Добро пожаловать"
    >
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (<FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="John Doe"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (<FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="******"
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}
                    />
                </div>
                <FormError message={error}/>
                <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                >
                    Войти
                </Button>
            </form>
        </Form>
    </CardWrapper>);
};