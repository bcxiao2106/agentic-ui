export function Localized(target: any, propertyKey: string) {
  Reflect.defineMetadata("localized", true, target, propertyKey);
}