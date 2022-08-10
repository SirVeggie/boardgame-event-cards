
export const contMinWidth = '700px';
export const contMaxWidth = '1000px';

export function titleShade(color: string, second?: string) {
    let variant: string;
    switch (color.length) {
        case 4:
            variant = `${color}5`;
            break;
        case 5:
            variant = `${color.substring(0, 4)}5`;
            break;
        case 7:
            variant = `${color}55`;
            break;
        case 9:
            variant = `${color.substring(0, 7)}55`;
            break;
        default:
            variant = color;
            break;
    }

    const extra = second ? `, ${second}` : '';
    const fill = second
        ? `linear-gradient(100deg, white, ${second})`
        : 'linear-gradient(100deg, white, #000a)';
    return `linear-gradient(100deg, ${variant}, ${color}${extra}), ${fill}`;
}