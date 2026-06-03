"use client"

import { useId } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthLogin } from "@repo/api-client"
import { AuthLoginQuerySchema, type AuthLogInUserReq } from "@repo/contract"
import { useT } from "@repo/i18n/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { Button } from "@repo/ui/components/button"
import { cn } from "@repo/ui/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = useId()
  const router = useRouter()
  const { t } = useT()

  const { mutate: loginMutate, isPending } = useAuthLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthLogInUserReq>({
    resolver: zodResolver(AuthLoginQuerySchema),
  })

  function onSubmit(data: AuthLogInUserReq) {
    loginMutate(
      { data },
      {
        onSuccess: () => {
          router.replace("/")
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { code?: string; message?: string } }
          }
          const code = axiosError?.response?.data?.code
          const message =
            axiosError?.response?.data?.message ??
            "Login failed. Please try again."

          if (code === "unauthorized" || code === "not_found") {
            setError("email", { message })
            setError("password", { message })
          } else {
            setError("root", { message })
          }
        },
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.info")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-email`}>
                  {t("auth.login.emailLabel")}
                </FieldLabel>
                <Input
                  id={`${id}-email`}
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  autoComplete="email"
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={`${id}-password`}>
                    {t("auth.login.passwordLabel")}
                  </FieldLabel>
                  <Link
                    href="/auth/forgot"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <Input
                  id={`${id}-password`}
                  type="password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  autoComplete="current-password"
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              {errors.root && <FieldError errors={[errors.root]} />}
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in…" : t("auth.login.submit")}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {t("auth.login.noAccount")}{" "}
                  <Link
                    href="/auth/signup"
                    className="underline-offset-4 hover:underline"
                  >
                    {t("auth.login.signUp")}
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
