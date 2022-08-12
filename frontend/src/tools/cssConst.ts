
export const contMinWidth = '700px';
export const contMaxWidth = '1000px';

export function titleShade(color: string, second?: string) {
    const variant = transparentize(color, '8');
    color = transparentize(color, '5');

    const extra = second ? `, ${second}` : '';
    const fill = second
        ? `linear-gradient(100deg, #fff2, ${second})`
        : 'linear-gradient(100deg, #fff2, #000a)';
    return `linear-gradient(100deg, ${variant}, ${color}${extra}), ${fill}`;
}

function transparentize(color: string, value: string) {
    switch (color.length) {
        case 4:
            return `${color}${value}`;
        case 5:
            return `${color.substring(0, 4)}${value}`;
        case 7:
            return `${color}${value}${value}`;
        case 9:
            return `${color.substring(0, 7)}${value}${value}`;
        default:
            return color;
    }
}