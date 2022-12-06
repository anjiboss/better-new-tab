import React, { useEffect, useState } from "react";
import { Image } from "react-konva";
interface Props {
  src: string;
  x: number;
  y: number;
  draggable?: boolean;
}

const URLImage: React.FC<Props> = (
  props = { src: "", x: 0, y: 0, draggable: false }
) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    loadImage();
  }, [props.src]);

  function loadImage() {
    const image = new window.Image();
    image.src = props.src;
    image.onload = () => {
      setImage(image);
    };
  }

  return (
    <>
      {image && (
        <Image
          draggable={props.draggable}
          image={image}
          x={props.x}
          y={props.y}
          width={64}
          height={64}
        />
      )}
    </>
  );
};

export default URLImage;
