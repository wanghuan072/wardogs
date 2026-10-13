"use client";

import { useEffect, useState } from "react";
import styles from "@/style/common/ad-slot.module.css";

type Viewport = "desktop" | "mobile";

const desktopBannerDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>html,body{margin:0;min-width:0;background:transparent;overflow:hidden}</style>
</head><body>
<script>atOptions={'key':'bed653f4347ed71eefc3d1e1cb4b143b','format':'iframe','height':90,'width':728,'params':{}};</script>
<script src="https://www.highrevenueformat.com/bed653f4347ed71eefc3d1e1cb4b143b/invoke.js"></script>
</body></html>`;

const mobileBannerDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>html,body{margin:0;min-width:0;background:transparent;overflow:hidden}</style>
</head><body>
<script>atOptions={'key':'ca1c319e998060873149d2fc20e39ea0','format':'iframe','height':250,'width':300,'params':{}};</script>
<script src="https://www.highrevenueformat.com/ca1c319e998060873149d2fc20e39ea0/invoke.js"></script>
</body></html>`;

export function AdSlot({ placement }: { placement: string }) {
  const [viewport, setViewport] = useState<Viewport | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const updateViewport = () => setViewport(media.matches ? "mobile" : "desktop");
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  const isMobile = viewport === "mobile";

  return (
    <aside className={styles.slot} data-ad-placement={placement} aria-label="Advertisement">
      {viewport ? (
        <iframe
          className={isMobile ? styles.mobileFrame : styles.desktopFrame}
          title="Affiliate advertisement"
          srcDoc={isMobile ? mobileBannerDocument : desktopBannerDocument}
          width={isMobile ? 300 : 728}
          height={isMobile ? 250 : 90}
          referrerPolicy="strict-origin-when-cross-origin"
          scrolling="no"
        />
      ) : null}
    </aside>
  );
}
