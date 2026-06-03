"use client"

import { useId } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { Button } from "@repo/ui/components/button"
import { cn } from "@repo/ui/lib/utils"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = useId()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Fill in your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor={`${id}-first-name`}>
                    First name
                  </FieldLabel>
                  <Input
                    id={`${id}-first-name`}
                    type="text"
                    placeholder="John"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-last-name`}>Last name</FieldLabel>
                  <Input
                    id={`${id}-last-name`}
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
                <Input
                  id={`${id}-email`}
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
                <Input id={`${id}-password`} type="password" required />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-confirm-password`}>
                  Confirm password
                </FieldLabel>
                <Input id={`${id}-confirm-password`} type="password" required />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Create account
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="underline-offset-4 hover:underline"
                  >
                    Log in
                  </a>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
