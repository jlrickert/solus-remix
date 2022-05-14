import * as List from "fp-ts/lib/ReadonlyArray";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";

/**
 * [sprite name, [x, y, width, height]]
 */
export type SpriteDefinition = [string, [number, number, number, number]];

function makePair(
    name: string,
    imageBitmap: ImageBitmap
): [string, ImageBitmap] {
    return [name, imageBitmap];
}

function fromPromiseFunction<P extends Promise<any>>(
    f: () => P
): T.Task<Awaited<P>> {
    return () => f();
}

export function spriteSheetCreator(
    createBitmapImage: typeof window.createImageBitmap
): (
    sheet: CanvasImageSource,
    definitions: readonly SpriteDefinition[]
) => T.Task<Map<string, ImageBitmap>> {
    return (sheet, definitions) => {
        return pipe(
            definitions,
            List.map(([name, dimensions]) => {
                return fromPromiseFunction(async () => {
                    const sprite = await createBitmapImage(
                        sheet,
                        ...dimensions
                    );
                    return makePair(name, sprite);
                });
            }),
            T.sequenceArray,
            T.map((sprites) => new Map(sprites))
        );
    };
}

export const windowSpriteSheetCreator = spriteSheetCreator(
    window.createImageBitmap
);
