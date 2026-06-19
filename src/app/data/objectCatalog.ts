import type { AddonDimensions, AddonObjectType } from '../types/spacecraftAddons';

export interface ObjectCatalogItem {
  type: AddonObjectType;
  nameRu: string;
  nameEn: string;
  categoryRu: string;
  categoryEn: string;
  descriptionRu: string;
  descriptionEn: string;
  dimensions: AddonDimensions;
  color: string;
}

export const OBJECT_CATALOG: ObjectCatalogItem[] = [
  { type: 'tableLamp', nameRu: 'Настольная лампа', nameEn: 'Table lamp', categoryRu: 'Свет', categoryEn: 'Lighting', descriptionRu: 'Для стола или тумбы', descriptionEn: 'For desk or nightstand', dimensions: { width: 0.32, depth: 0.32, height: 0.48 }, color: '#D7B979' },
  { type: 'floorLamp', nameRu: 'Торшер', nameEn: 'Floor lamp', categoryRu: 'Свет', categoryEn: 'Lighting', descriptionRu: 'Высокий напольный светильник', descriptionEn: 'Tall floor light', dimensions: { width: 0.38, depth: 0.38, height: 1.65 }, color: '#C7A467' },
  { type: 'floorMirror', nameRu: 'Зеркало в пол', nameEn: 'Floor mirror', categoryRu: 'Декор', categoryEn: 'Decor', descriptionRu: 'Высокое зеркало для стены', descriptionEn: 'Tall wall mirror', dimensions: { width: 0.75, depth: 0.08, height: 1.75 }, color: '#C8D8DA' },
  { type: 'chair', nameRu: 'Стул', nameEn: 'Chair', categoryRu: 'Мебель', categoryEn: 'Furniture', descriptionRu: 'Обычный стул для стола', descriptionEn: 'Basic dining or desk chair', dimensions: { width: 0.55, depth: 0.55, height: 0.9 }, color: '#9B7654' },
  { type: 'officeChair', nameRu: 'Офисное кресло', nameEn: 'Office chair', categoryRu: 'Мебель', categoryEn: 'Furniture', descriptionRu: 'Кресло для рабочего места', descriptionEn: 'Chair for workspace', dimensions: { width: 0.65, depth: 0.65, height: 1.05 }, color: '#5B5E62' },
  { type: 'laptop', nameRu: 'Ноутбук', nameEn: 'Laptop', categoryRu: 'Техника', categoryEn: 'Devices', descriptionRu: 'Для рабочего стола', descriptionEn: 'For desk setup', dimensions: { width: 0.36, depth: 0.25, height: 0.04 }, color: '#2E3033' },
  { type: 'monitor', nameRu: 'Монитор', nameEn: 'Monitor', categoryRu: 'Техника', categoryEn: 'Devices', descriptionRu: 'Экран для рабочего места', descriptionEn: 'Screen for workspace', dimensions: { width: 0.58, depth: 0.22, height: 0.46 }, color: '#25282D' },
  { type: 'plant', nameRu: 'Растение', nameEn: 'Plant', categoryRu: 'Декор', categoryEn: 'Decor', descriptionRu: 'Живой акцент в комнате', descriptionEn: 'Green room accent', dimensions: { width: 0.45, depth: 0.45, height: 0.95 }, color: '#5F8A5E' },
  { type: 'rug', nameRu: 'Ковёр', nameEn: 'Rug', categoryRu: 'Текстиль', categoryEn: 'Textile', descriptionRu: 'Плоский ковёр на полу', descriptionEn: 'Flat floor rug', dimensions: { width: 1.8, depth: 1.2, height: 0.025 }, color: '#D8C4A8' },
  { type: 'books', nameRu: 'Книги', nameEn: 'Books', categoryRu: 'Декор', categoryEn: 'Decor', descriptionRu: 'Стопка книг', descriptionEn: 'Book stack', dimensions: { width: 0.34, depth: 0.22, height: 0.18 }, color: '#A35F4B' },
  { type: 'tv', nameRu: 'Телевизор', nameEn: 'TV', categoryRu: 'Техника', categoryEn: 'Devices', descriptionRu: 'Тонкий экран', descriptionEn: 'Thin screen', dimensions: { width: 1.2, depth: 0.08, height: 0.72 }, color: '#1F2227' },
  { type: 'keyboard', nameRu: 'Клавиатура', nameEn: 'Keyboard', categoryRu: 'Техника', categoryEn: 'Devices', descriptionRu: 'Аксессуар для рабочего стола', descriptionEn: 'Desk accessory', dimensions: { width: 0.42, depth: 0.14, height: 0.035 }, color: '#333333' },
  { type: 'speakers', nameRu: 'Колонки', nameEn: 'Speakers', categoryRu: 'Техника', categoryEn: 'Devices', descriptionRu: 'Пара небольших колонок', descriptionEn: 'Small speaker pair', dimensions: { width: 0.42, depth: 0.18, height: 0.32 }, color: '#34302C' },
];
export const getObjectCatalogItem = (type: AddonObjectType) => OBJECT_CATALOG.find((item) => item.type === type);
