import { useTileStore } from "./store/useTileStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageTileMap from "./ImageTileMap";
import Header from "@/components/header";
import { useI18n } from "./components/i18n-provider";
import Guide from "./components/guide";

const DEMO_IMAGES = [
  {
    name: "塞尔达地图1",
    url: "https://raw.githubusercontent.com/zhuguibiao/image-to-tile/refs/heads/main/files/input/game1.png",
  },
  {
    name: "塞尔达地图2",
    url: "https://raw.githubusercontent.com/zhuguibiao/image-to-tile/refs/heads/main/files/input/game2.png",
  },
  {
    name: "世界地图",
    url: "https://raw.githubusercontent.com/zhuguibiao/image-to-tile/refs/heads/main/files/input/map.jpeg",
  },
  {
    name: "风景图",
    url: "https://raw.githubusercontent.com/zhuguibiao/image-to-tile/refs/heads/main/files/input/1111.jpg",
  },
  {
    name: "梅花图",
    url: "https://raw.githubusercontent.com/zhuguibiao/image-to-tile/refs/heads/main/files/input/2222.jpg",
  },
];

export default function App() {
  const {
    tiles,
    imageSize,
    loading,
    showZip,
    setFile,
    sendDemo,
    generateTiles,
    downloadZip,
  } = useTileStore();
  const { t } = useI18n();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <Card className="p-4">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center">
                <div className="flex flex-wrap gap-3 items-center flex-1">
                  <Select onValueChange={sendDemo}>
                    <SelectTrigger className="w-[200px] ">
                      <SelectValue placeholder={t("select_demo")} />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {DEMO_IMAGES.map((img) => (
                        <SelectItem key={img.url} value={img.url}>
                          {img.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="max-w-2xs"
                  />

                  <Button onClick={generateTiles} disabled={loading}>
                    {t("generate")}
                  </Button>

                  {loading && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      {t("generating")}
                    </p>
                  )}

                  {!loading && showZip && (
                    <Button onClick={downloadZip}>{t("download")}</Button>
                  )}
                </div>

                <Guide />
              </div>
            </CardContent>
          </Card>

          <div>
            {t('image_info')}: {imageSize[0]} x {imageSize[1]}
          </div>
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div className="h-[600px] w-full">
                <ImageTileMap tiles={tiles} imageSize={imageSize} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
