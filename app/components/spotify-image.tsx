import { ComponentProps } from "react";

type Props = ComponentProps<"img"> & {
  image?: SpotifyApi.ImageObject;
};

export function SpotifyImage({ image, ...props }: Props) {
  if (!image) return null;

  return (
    <img src={image.url} width={image.width} height={image.height} {...props} />
  );
}
