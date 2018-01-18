export function memberLinksToMD(name, links) {
    return (
        links.website ? 
            `${name}的网站是：[${links.website}](${links.website})` : 
            `${name}还没有网站`
    ) +
    '，' + 
    (
        links.github ? 
            `${name}的 Github 是：[@${links.github}](https://github.com/${links.github})` : 
            `${name}还没有 Github`
    );
}

export default {
    memberLinksToMD
}