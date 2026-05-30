"use client";

import { useGetUserSelf } from "@repo/api-client";
import { useT } from "@repo/i18n/client";
import { Button } from "@repo/ui-web/ui/button";

export default function Home() {
  const { data, isPending } = useGetUserSelf();
  const { t } = useT();

  console.log({ data, isPending });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold underline">
          {t("home.greeting", { firstName: data?.firstName })}
        </h1>

        <div>
          <Button variant="outline" size="lg">
            Button
          </Button>
        </div>
      </div>
    </div>
  );
}
