import { IcDocker, IcMenu, IcReact, IcTailwind, IcTypescript, IcVite } from '@/icons'
import type { IconProps } from '@/shared/types'

const iconMap = {
    'docker': IcDocker,
    'menu': IcMenu,
    'react': IcReact,
    'tailwind': IcTailwind,
    'typescript': IcTypescript,
    'vite': IcVite
} as const

export type IconName = keyof typeof iconMap
export const iconNames = Object.keys(iconMap) as IconName[]

export default function Icon({ className, name, size, color, variant }: IconProps)
{
    const currentSize = size ? size : 24
    const currentColor = color ? color : '#999999'

    const fallbackName: IconName = 'menu'
    const iconName = (name && iconMap[name]) ? name : fallbackName

    if(!name || !iconMap[name])
    {
        console.warn(`[Icon] Unknown icon name: "${name}", falling back to "${fallbackName}"`)
    }

    const IconComponent = iconMap[iconName]
    return <IconComponent className={className} size={currentSize} color={currentColor} variant={variant} />
}