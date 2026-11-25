/** Picture icons from src/assets/icons, named "folder/file". */
const FILES = import.meta.glob<string>('../assets/icons/*/*.webp', { eager: true, import: 'default' });
const ICONS = new Map(Object.entries(FILES).map(([path, url]) => [path.replace('../assets/icons/', '').replace('.webp', ''), url]));

export const hasIcon = (name: string) => ICONS.has(name);
export const Icon = ({ name, size = 32 }: { name: string; size?: number }) => <img className="ico" src={ICONS.get(name)} width={size} height={size} alt="" draggable={false} />;
