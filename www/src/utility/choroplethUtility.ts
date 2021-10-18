
export function getCssClassForZScore(z: number) {
    // return z > 3.0 ? 'choropleth-6' :
        //    z > 2.5 ? 'choropleth-5' :
    return       z > 2.0 ? 'choropleth-4' :
        //    z > 1.7 ? 'choropleth-3' :
        //    z > 1.4 ? 'choropleth-2' :
           z > 1.0 ? 'choropleth-1' :
                     'choropleth-0';
}

export function getColour(z: number) {
    return z > 3.0 ? '#880e4f' :
           z > 2.5 ? '#ad1457' :
           z > 2.0 ? '#c2185b' :
           z > 1.7 ? '#f48fb1' :
           z > 1.4 ? '#fff59d' :
           z > 1.0 ? '#fff9c4' :
                     'white';
}
