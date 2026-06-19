Файлы для SpaceCraft:

src/app/types/spacecraftAddons.ts
src/app/data/objectCatalog.ts
src/app/lib/openingUtils.ts
src/app/components/scene/AddonObjectModel.tsx
src/app/components/scene/ArchitecturalOpeningModel.tsx
src/app/components/ui/ObjectCatalogPanel.tsx
src/app/components/ui/OpeningsPanel.tsx

Команды для создания папок в PowerShell из корня проекта:
mkdir src/app/types -Force
mkdir src/app/data -Force
mkdir src/app/lib -Force
mkdir src/app/components/scene -Force
mkdir src/app/components/ui -Force

Важно: эти файлы — готовые модули. Чтобы они появились в твоём интерфейсе, их нужно подключить в LeftPanel/Room/useStore.
Окна и двери хранятся как ArchitecturalOpening[] и всегда привязываются к стене через wall + offset.
Предметы хранятся как AddonObjectItem[] и имеют размеры width/depth/height, которые можно менять так же, как мебель.
