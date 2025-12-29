import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";
import { Github } from "lucide-react";
import { useI18n } from "./i18n-provider";

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <div className="flex-1 flex items-center gap-2">
          <h1 className="text-lg font-semibold capitalize">{t("title")}</h1>
        </div>
        <div className="flex gap-2  h-14 items-center px-4 ">
          <LanguageToggle />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/zhuguibiao/image-to-tile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
