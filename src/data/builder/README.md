# 构筑器数据说明

`armory-tabs.json` 只保存军械库分类的展示文案和顺序。

- `id` 必须与 `EquipmentBuilder.tsx` 中的 `ArmoryTab` 对应。
- `label` 是桌面端名称，`shortLabel` 是窄屏名称。
- `description` 会显示在分类标题和操作提示中。

图标、筛选条件和装备兼容性规则仍保留在 TypeScript 中。这样修改文案不需要改逻辑，同时保留编译期类型检查。
