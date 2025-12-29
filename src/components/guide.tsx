"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { useI18n } from "./i18n-provider";

export default function Guide() {
  const { t } = useI18n();
  return (
    <div className="text-sm opacity-70">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            title={t("guide_title")}
            variant="outline"
            size="icon"
            className="relative"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[340px] text-sm leading-relaxed z-[9999]">
          <div className="space-y-3">
            <div>
              <b>{t("guide_title")}</b>：<div>1. {t("guide_d1")}</div>
              <div>2. {t("guide_d2")}</div>
              <div>3. {t("guide_d3")}</div>
              <div>4. {t("guide_d4")}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
